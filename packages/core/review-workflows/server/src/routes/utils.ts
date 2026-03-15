export const enableFeatureMiddleware = (featureName: string) => (ctx: any, next: any) => {
  if (leao.ee.features.isEnabled(featureName)) {
    return next();
  }

  ctx.status = 404;
};
