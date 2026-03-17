import type { Context } from 'koa';
import { getService } from '../utils';
import { scheduleReloadAfterResponse } from '../utils/reload';
import validateComponentCategory from './validation/component-category';

export default {
  async editCategory(ctx: Context) {
    const body = ctx.request.body as any;

    try {
      await validateComponentCategory(body);
    } catch (error) {
      return ctx.send({ error }, 400);
    }

    const { name } = ctx.params;

    leao.reload.isWatching = false;

    const componentCategoryService = getService('component-categories');

    const newName = await componentCategoryService.editCategory(name, body);

    scheduleReloadAfterResponse();

    ctx.send({ name: newName });
  },

  async deleteCategory(ctx: Context) {
    const { name } = ctx.params;

    leao.reload.isWatching = false;

    const componentCategoryService = getService('component-categories');

    await componentCategoryService.deleteCategory(name);

    scheduleReloadAfterResponse();

    ctx.send({ name });
  },
};
