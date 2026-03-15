import _ from 'lodash';
import type { Context } from 'koa';
import type {} from 'koa-body';
import type { Internal } from '@leao/types';
import { getService } from '../utils';
import {
  validateContentTypeInput,
  validateUpdateContentTypeInput,
  validateKind,
} from './validation/content-type';

export default {
  async getContentTypes(ctx: Context) {
    const { kind } = ctx.query;

    try {
      await validateKind(kind);
    } catch (error) {
      return ctx.send({ error }, 400);
    }

    const contentTypeService = getService('content-types');

    const contentTypes = Object.keys(leao.contentTypes)
      .filter(
        (uid) =>
          !kind ||
          _.get(leao.contentTypes[uid as Internal.UID.ContentType], 'kind', 'collectionType') ===
            kind
      )
      .map((uid) =>
        contentTypeService.formatContentType(leao.contentTypes[uid as Internal.UID.ContentType])
      );

    ctx.send({
      data: contentTypes,
    });
  },

  getContentType(ctx: Context) {
    const { uid } = ctx.params;

    const contentType = leao.contentTypes[uid];

    if (!contentType) {
      return ctx.send({ error: 'contentType.notFound' }, 404);
    }

    const contentTypeService = getService('content-types');

    ctx.send({ data: contentTypeService.formatContentType(contentType) });
  },

  async createContentType(ctx: Context) {
    const body = ctx.request.body as any;

    try {
      await validateContentTypeInput(body);
    } catch (error) {
      return ctx.send({ error }, 400);
    }

    try {
      leao.reload.isWatching = false;

      const contentTypeService = getService('content-types');

      const contentType = await contentTypeService.createContentType({
        contentType: body.contentType,
        components: body.components,
      });

      const metricsPayload = {
        eventProperties: {
          kind: contentType.kind,
        },
      };

      if (_.isEmpty(leao.apis)) {
        await leao.telemetry.send('didCreateFirstContentType', metricsPayload);
      } else {
        await leao.telemetry.send('didCreateContentType', metricsPayload);
      }

      setImmediate(() => leao.reload());

      ctx.send({ data: { uid: contentType.uid } }, 201);
    } catch (err) {
      leao.log.error(err);
      await leao.telemetry.send('didNotCreateContentType', {
        eventProperties: { error: (err as Error).message || err },
      });
      ctx.send({ error: (err as Error).message || 'Unknown error' }, 400);
    }
  },

  async updateContentType(ctx: Context) {
    const { uid } = ctx.params;
    const body = ctx.request.body as any;

    if (!_.has(leao.contentTypes, uid)) {
      return ctx.send({ error: 'contentType.notFound' }, 404);
    }

    try {
      await validateUpdateContentTypeInput(body);
    } catch (error) {
      return ctx.send({ error }, 400);
    }

    try {
      leao.reload.isWatching = false;

      const contentTypeService = getService('content-types');

      const component = await contentTypeService.editContentType(uid, {
        contentType: body.contentType,
        components: body.components,
      });

      setImmediate(() => leao.reload());

      ctx.send({ data: { uid: component.uid } }, 201);
    } catch (error) {
      leao.log.error(error);
      ctx.send({ error: (error as Error)?.message || 'Unknown error' }, 400);
    }
  },

  async deleteContentType(ctx: Context) {
    const { uid } = ctx.params;

    if (!_.has(leao.contentTypes, uid)) {
      return ctx.send({ error: 'contentType.notFound' }, 404);
    }

    try {
      leao.reload.isWatching = false;

      const contentTypeService = getService('content-types');

      const component = await contentTypeService.deleteContentType(uid);

      setImmediate(() => leao.reload());

      ctx.send({ data: { uid: component.uid } });
    } catch (error) {
      leao.log.error(error);
      ctx.send({ error: (error as Error)?.message || 'Unknown error' }, 400);
    }
  },
};
