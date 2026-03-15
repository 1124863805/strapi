export const register = ({ leao }: any) => {
  leao.customFields.register({
    name: 'color',
    plugin: 'color-picker',
    type: 'string',
  });
};
