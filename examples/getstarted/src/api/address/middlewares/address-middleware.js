module.exports = (options) => {
  return (ctx, next) => {
    ctx.set('X-Leao-Test', 'Address Middleware');
    return next();
  };
};
