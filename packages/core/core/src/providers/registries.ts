import { hooks } from '@leao1/utils';

import { defineProvider } from './provider';
import * as registries from '../registries';
import { loadApplicationContext } from '../loaders';
import * as syncMigrations from '../migrations';
import { discardDocumentDrafts } from '../migrations/database/5.0.0-discard-drafts';

export default defineProvider({
  init(leao) {
    leao
      .add('content-types', () => registries.contentTypes())
      .add('components', () => registries.components())
      .add('services', () => registries.services(leao))
      .add('policies', () => registries.policies())
      .add('middlewares', () => registries.middlewares())
      .add('hooks', () => registries.hooks())
      .add('controllers', () => registries.controllers(leao))
      .add('modules', () => registries.modules(leao))
      .add('plugins', () => registries.plugins(leao))
      .add('custom-fields', () => registries.customFields(leao))
      .add('apis', () => registries.apis(leao))
      .add('models', () => registries.models())
      .add('sanitizers', registries.sanitizers())
      .add('validators', registries.validators());
  },
  async register(leao) {
    await loadApplicationContext(leao);

    leao.get('hooks').set('leao::content-types.beforeSync', hooks.createAsyncParallelHook());
    leao.get('hooks').set('leao::content-types.afterSync', hooks.createAsyncParallelHook());

    // Content migration to enable draft and publish
    leao.hook('leao::content-types.beforeSync').register(syncMigrations.disable);
    leao.hook('leao::content-types.afterSync').register(syncMigrations.enable);

    // Database migrations
    leao.db.migrations.providers.internal.register(discardDocumentDrafts);
  },
});
