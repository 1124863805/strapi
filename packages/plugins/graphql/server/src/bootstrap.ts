import { isEmpty, mergeWith, isArray, isObject } from 'lodash/fp';
import { ApolloServer, type ApolloServerOptions } from '@apollo/server';
import {
  ApolloServerPluginLandingPageLocalDefault,
  ApolloServerPluginLandingPageProductionDefault,
} from '@apollo/server/plugin/landingPage/default';
import { koaMiddleware } from '@as-integrations/koa';
import depthLimit from 'graphql-depth-limit';
import bodyParser from 'koa-bodyparser';
import cors from '@koa/cors';

import type { Core } from '@leao/types';
import type { BaseContext, DefaultContextExtends, DefaultStateExtends } from 'koa';

import { formatGraphqlError } from './format-graphql-error';

const merge = mergeWith((a, b) => {
  if (isArray(a) && isArray(b)) {
    return a.concat(b);
  }
});

export async function bootstrap({ leao }: { leao: Core.Leao }) {
  // Generate the GraphQL schema for the content API
  const schema = leao.plugin('graphql').service('content-api').buildSchema();

  if (isEmpty(schema)) {
    leao.log.warn('The GraphQL schema has not been generated because it is empty');

    return;
  }

  const { config } = leao.plugin('graphql');

  const path: string = config('endpoint');

  // TODO: rename playgroundAlways since it's not playground anymore
  const playgroundEnabled = !(process.env.NODE_ENV === 'production' && !config('playgroundAlways'));

  let landingPage;
  if (playgroundEnabled) {
    landingPage = ApolloServerPluginLandingPageLocalDefault();
    leao.log.debug('Using Apollo sandbox landing page');
  } else {
    landingPage = ApolloServerPluginLandingPageProductionDefault();
    leao.log.debug('Using Apollo production landing page');
  }

  type CustomOptions = {
    cors: boolean;
    uploads: boolean;
    bodyParserConfig: boolean;
  };

  const defaultServerConfig: ApolloServerOptions<BaseContext> & CustomOptions = {
    // Schema
    schema,

    // Validation
    validationRules: [depthLimit(config('depthLimit') as number) as any],

    // Errors
    formatError: formatGraphqlError,

    // Misc
    cors: false,
    uploads: false,
    bodyParserConfig: true,
    // send 400 http status instead of 200 for input validation errors
    status400ForVariableCoercionErrors: true,
    plugins: [landingPage],

    cache: 'bounded' as const,
  };

  const serverConfig = merge(
    defaultServerConfig,
    config('apolloServer')
  ) as ApolloServerOptions<BaseContext> & CustomOptions;

  // Create a new Apollo server
  const server = new ApolloServer(serverConfig);

  try {
    // server.start() must be called before using server.applyMiddleware()
    await server.start();
  } catch (error) {
    if (error instanceof Error) {
      leao.log.error('Failed to start the Apollo server', error.message);
    }

    throw error;
  }

  // Create the route handlers for Leao
  const handler: Core.MiddlewareHandler[] = [];

  // add cors middleware
  if (cors) {
    handler.push(cors());
  }

  // add koa bodyparser middleware
  if (isObject(serverConfig.bodyParserConfig)) {
    handler.push(bodyParser(serverConfig.bodyParserConfig));
  } else if (serverConfig.bodyParserConfig) {
    handler.push(bodyParser());
  } else {
    leao.log.debug('Body parser has been disabled for Apollo server');
  }

  // add the Leao auth middleware
  handler.push((ctx, next) => {
    ctx.state.route = {
      info: {
        // Indicate it's a content API route
        type: 'content-api',
      },
    };

    return leao.auth.authenticate(ctx, next);
  });

  // add the graphql server for koa
  handler.push(
    koaMiddleware<DefaultStateExtends, DefaultContextExtends>(server, {
      // Initialize loaders for this request.
      context: async ({ ctx }) => ({
        state: ctx.state,
        koaContext: ctx,
      }),
    })
  );

  // now that handlers are set up, add the graphql route to our apollo server
  leao.server.routes([
    {
      method: 'ALL',
      path,
      handler,
      config: {
        auth: false,
      },
    },
  ]);

  // Register destroy behavior
  // We're doing it here instead of exposing a destroy method to the leao-server.js
  // file since we need to have access to the ApolloServer instance
  leao.plugin('graphql').destroy = async () => {
    await server.stop();
  };
}
