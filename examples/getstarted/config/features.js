module.exports = ({ env }) => ({
  future: {
    preview: env.bool('LEAO_FUTURE_PREVIEW', false),
  },
});
