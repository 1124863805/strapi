import _ from 'lodash';
import type { Context } from 'koa';
import type { UID } from '@leao1/types';
import { getService } from '../utils';
import { scheduleReloadAfterResponse } from '../utils/reload';
import { validateComponentInput, validateUpdateComponentInput } from './validation/component';

export default {
  /**
   * GET /components handler
   * Returns a list of available components
   * @param {Object} ctx - koa context
   */
  async getComponents(ctx: Context) {
    const componentService = getService('components');
    const componentUIDs = Object.keys(leao.components) as UID.Component[];

    const data = componentUIDs.map((uid) => {
      return componentService.formatComponent(leao.components[uid]);
    });

    ctx.send({ data });
  },

  /**
   * GET /components/:uid
   * Returns a specific component
   * @param {Object} ctx - koa context
   */
  async getComponent(ctx: Context) {
    const { uid } = ctx.params;

    const component = leao.components[uid];

    if (!component) {
      return ctx.send({ error: 'component.notFound' }, 404);
    }

    const componentService = getService('components');

    ctx.send({ data: componentService.formatComponent(component) });
  },

  /**
   * POST /components
   * Creates a component and returns its infos
   * @param {Object} ctx - koa context
   */
  async createComponent(ctx: Context) {
    const body = ctx.request.body as any;

    try {
      await validateComponentInput(body);
    } catch (error) {
      return ctx.send({ error }, 400);
    }

    try {
      leao.reload.isWatching = false;

      const componentService = getService('components');

      const component = await componentService.createComponent({
        component: body.component,
        components: body.components,
      });

      scheduleReloadAfterResponse();

      ctx.send({ data: { uid: component.uid } }, 201);
    } catch (error) {
      leao.log.error(error);
      ctx.send({ error: (error as any)?.message || 'Unknown error' }, 400);
    }
  },

  /**
   * PUT /components/:uid
   * Updates a component and return its infos
   * @param {Object} ctx - koa context - enhanced koa context
   */
  async updateComponent(ctx: Context) {
    const { uid } = ctx.params;
    const body = ctx.request.body as any;

    if (!_.has(leao.components, uid)) {
      return ctx.send({ error: 'component.notFound' }, 404);
    }

    try {
      await validateUpdateComponentInput(body);
    } catch (error) {
      return ctx.send({ error }, 400);
    }

    try {
      leao.reload.isWatching = false;

      const componentService = getService('components');

      const component = (await componentService.editComponent(uid, {
        component: body.component,
        components: body.components,
      })) as any;

      scheduleReloadAfterResponse();

      ctx.send({ data: { uid: component.uid } });
    } catch (error) {
      leao.log.error(error);

      ctx.send({ error: (error as any)?.message || 'Unknown error' }, 400);
    }
  },

  /**
   * DELETE /components/:uid
   * Deletes a components and returns its old infos
   * @param {Object} ctx - koa context
   */
  async deleteComponent(ctx: Context) {
    const { uid } = ctx.params;

    if (!_.has(leao.components, uid)) {
      return ctx.send({ error: 'component.notFound' }, 404);
    }

    try {
      leao.reload.isWatching = false;

      const componentService = getService('components');

      const component = await componentService.deleteComponent(uid);

      scheduleReloadAfterResponse();

      ctx.send({ data: { uid: component.uid } });
    } catch (error) {
      leao.log.error(error);
      ctx.send({ error: (error as any)?.message || 'Unknown error' }, 400);
    }
  },
};
