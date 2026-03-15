import { pick } from 'lodash/fp';
import { errors } from '@leao1/utils';

import type Koa from 'koa';
import type {} from 'koa-body';
import type { EmailConfig, SendOptions } from '../types';

const { ApplicationError } = errors;

/**
 * Email.js controller
 *
 * @description: A set of functions called "actions" of the `email` plugin.
 */
const emailController = {
  async send(ctx: Koa.Context) {
    const options = ctx.request.body as SendOptions;

    try {
      await leao.plugin('email').service('email').send(options);
    } catch (error) {
      if (error instanceof Error) {
        if ('statusCode' in error && error.statusCode === 400) {
          throw new ApplicationError(error.message);
        } else {
          throw new Error(`Couldn't send email: ${error.message}.`);
        }
      }
    }

    // Send 200 `ok`
    ctx.send({});
  },

  async test(ctx: Koa.Context) {
    const { to } = ctx.request.body as Pick<SendOptions, 'to'>;

    if (!to) {
      throw new ApplicationError('No recipient(s) are given');
    }

    const email: SendOptions = {
      to,
      subject: `Leao test mail to: ${to}`,
      text: `Great! You have correctly configured the Leao email plugin with the ${leao.config.get(
        'plugin::email.provider'
      )} provider. \r\nFor documentation on how to use the email plugin, see your project documentation.`,
    };

    try {
      await leao.plugin('email').service('email').send(email);
    } catch (error) {
      if (error instanceof Error) {
        if ('statusCode' in error && error.statusCode === 400) {
          throw new ApplicationError(error.message);
        } else {
          throw new Error(`Couldn't send test email: ${error.message}.`);
        }
      }
    }

    // Send 200 `ok`
    ctx.send({});
  },

  async getSettings(ctx: Koa.Context) {
    const config: EmailConfig = leao.plugin('email').service('email').getProviderSettings();

    ctx.send({
      config: pick(
        ['provider', 'settings.defaultFrom', 'settings.defaultReplyTo', 'settings.testAddress'],
        config
      ),
    });
  },
};

export default emailController;
