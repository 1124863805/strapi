import type { Core } from '@leao1/types';

import { getService } from './utils';

// Add permissions
const RBAC_ACTIONS = [
  {
    section: 'plugins',
    displayName: 'Access the Documentation',
    uid: 'read',
    pluginName: 'documentation',
  },
  {
    section: 'plugins',
    displayName: 'Update and delete',
    uid: 'settings.update',
    pluginName: 'documentation',
  },
  {
    section: 'plugins',
    displayName: 'Regenerate',
    uid: 'settings.regenerate',
    pluginName: 'documentation',
  },
  {
    section: 'settings',
    displayName: 'Access the documentation settings page',
    uid: 'settings.read',
    pluginName: 'documentation',
    category: 'documentation',
  },
];

export async function bootstrap({ leao }: { leao: Core.Leao }) {
  await leao.service('admin::permission').actionProvider.registerMany(RBAC_ACTIONS);

  const pluginStore = leao.store!({
    environment: '',
    type: 'plugin',
    name: 'documentation',
  });

  const config = await pluginStore.get({ key: 'config' });

  if (!config) {
    pluginStore.set({ key: 'config', value: { restrictedAccess: false } });
  }

  // Generate docs in background to avoid blocking startup (develop load)
  getService('documentation')
    .generateFullDoc()
    .catch((err) => leao.log.warn('Documentation generation failed:', err));
}
