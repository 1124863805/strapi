/* eslint-disable @typescript-eslint/no-var-requires */
import type { Core } from '@leao1/types';

import { ACTIONS, RELEASE_MODEL_UID, RELEASE_ACTION_MODEL_UID } from './constants';
import {
  deleteActionsOnDeleteContentType,
  deleteActionsOnDisableDraftAndPublish,
  migrateIsValidAndStatusReleases,
  revalidateChangedContentTypes,
  disableContentTypeLocalized,
  enableContentTypeLocalized,
} from './migrations';
import { addEntryDocumentToReleaseActions } from './migrations/database/5.0.0-document-id-in-actions';

export const register = async ({ leao }: { leao: Core.Leao }) => {
  if (leao.ee.features.isEnabled('cms-content-releases')) {
    await leao.service('admin::permission').actionProvider.registerMany(ACTIONS);

    leao.db.migrations.providers.internal.register(addEntryDocumentToReleaseActions);

    leao
      .hook('leao::content-types.beforeSync')
      .register(disableContentTypeLocalized)
      .register(deleteActionsOnDisableDraftAndPublish);

    leao
      .hook('leao::content-types.afterSync')
      .register(deleteActionsOnDeleteContentType)
      .register(enableContentTypeLocalized)
      .register(revalidateChangedContentTypes)
      .register(migrateIsValidAndStatusReleases);
  }

  if (leao.plugin('graphql')) {
    const graphqlExtensionService = leao.plugin('graphql').service('extension');
    // Exclude the release and release action models from the GraphQL schema
    graphqlExtensionService.shadowCRUD(RELEASE_MODEL_UID).disable();
    graphqlExtensionService.shadowCRUD(RELEASE_ACTION_MODEL_UID).disable();
  }
};
