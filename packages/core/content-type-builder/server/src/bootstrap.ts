import type { Core } from '@leao1/types';

export default async ({ leao }: { leao: Core.Leao }) => {
  const actions = [
    {
      section: 'plugins',
      displayName: 'Read',
      uid: 'read',
      pluginName: 'content-type-builder',
    },
  ];

  await leao.service('admin::permission').actionProvider.registerMany(actions);
};
