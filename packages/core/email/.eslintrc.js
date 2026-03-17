module.exports = {
  root: true,
  overrides: [
    {
      files: ['**/*'],
      excludedFiles: ['admin/**/*', 'server/**/*'],
      extends: ['@leao1/config/back'],
    },
  ],
};
