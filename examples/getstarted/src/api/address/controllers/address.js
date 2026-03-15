const { createCoreController } = require('@leao/leao').factories;

module.exports = createCoreController('api::address.address', {
  async find(ctx) {
    const { results } = await leao.service('api::address.address').find();

    ctx.body = await this.sanitizeOutput(results, ctx);
  },
});
