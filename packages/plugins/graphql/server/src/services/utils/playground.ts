import { Context } from '../types';

export default (ctx: Context) => {
  return {
    isEnabled() {
      return !(
        process.env.NODE_ENV === 'production' &&
        !ctx.leao.plugin('graphql').config('playgroundAlways')
      );
    },
  };
};
