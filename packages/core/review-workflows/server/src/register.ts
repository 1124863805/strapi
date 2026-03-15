import { defaultsDeep } from 'lodash/fp';

import type { Core } from '@leao1/types';

import { getService } from './utils';
import migrateStageAttribute from './migrations/shorten-stage-attribute';
import migrateReviewWorkflowStagesColor from './migrations/set-stages-default-color';
import migrateReviewWorkflowStagesRoles from './migrations/set-stages-roles';
import migrateReviewWorkflowName from './migrations/set-workflow-default-name';
import migrateWorkflowsContentTypes from './migrations/multiple-workflows';
import migrateDeletedCTInWorkflows from './migrations/handle-deleted-ct-in-workflows';
import reviewWorkflowsMiddlewares from './middlewares/review-workflows';

import { getVisibleContentTypesUID } from './utils/review-workflows';

import {
  ENTITY_STAGE_ATTRIBUTE,
  ENTITY_ASSIGNEE_ATTRIBUTE,
  STAGE_MODEL_UID,
  MAX_WORKFLOWS,
  MAX_STAGES_PER_WORKFLOW,
} from './constants/workflows';

// import { persistTables, removePersistedTablesWithSuffix } from '../../utils/persisted-tables';

const setRelation = (attributeName: any, target: any, contentType: any) => {
  Object.assign(contentType.attributes, {
    [attributeName]: {
      writable: true,
      private: false,
      configurable: false,
      visible: false,
      useJoinTable: true, // We want a join table to persist data when downgrading to CE
      type: 'relation',
      relation: 'oneToOne',
      target,
    },
  });

  return contentType;
};

/**
 * Add the stage and assignee attributes to content types
 */
function extendReviewWorkflowContentTypes({ leao }: { leao: Core.Leao }) {
  const contentTypeToExtend = getVisibleContentTypesUID(leao.contentTypes);

  for (const contentTypeUID of contentTypeToExtend) {
    leao.get('content-types').extend(contentTypeUID, (contentType: any) => {
      // Set Stage attribute
      setRelation(ENTITY_STAGE_ATTRIBUTE, STAGE_MODEL_UID, contentType);
      // Set Assignee attribute
      setRelation(ENTITY_ASSIGNEE_ATTRIBUTE, 'admin::user', contentType);
    });
  }
}

// TODO: V5
// function persistStagesJoinTables({ leao }: { leao: Core.LoadedLeao }) {
//   return async ({ contentTypes }: any) => {
//     const getStageTableToPersist = (contentTypeUID: any) => {
//       // Persist the stage join table
//       const { attributes, tableName } = leao.db.metadata.get(contentTypeUID) as any;
//       const joinTableName = attributes[ENTITY_STAGE_ATTRIBUTE].joinTable.name;
//       return {
//         name: joinTableName,
//         dependsOn: [{ name: tableName }],
//       };
//     };

//     const joinTablesToPersist = pipe([
//       getVisibleContentTypesUID,
//       filter((uid: any) => hasStageAttribute(contentTypes[uid])),
//       map(getStageTableToPersist),
//     ])(contentTypes);

// await removePersistedTablesWithSuffix('_leao_stage_links');
// await persistTables(joinTablesToPersist);
// };
// }

export default async ({ leao }: { leao: Core.Leao }) => {
  // Data Migrations
  leao.hook('leao::content-types.beforeSync').register(migrateStageAttribute);
  leao
    .hook('leao::content-types.afterSync')
    .register(migrateReviewWorkflowStagesColor)
    .register(migrateReviewWorkflowStagesRoles)
    .register(migrateReviewWorkflowName)
    .register(migrateWorkflowsContentTypes)
    .register(migrateDeletedCTInWorkflows);

  // Middlewares
  reviewWorkflowsMiddlewares.contentTypeMiddleware(leao);

  // Schema customization
  extendReviewWorkflowContentTypes({ leao });

  const reviewWorkflowsOptions = defaultsDeep(
    {
      numberOfWorkflows: MAX_WORKFLOWS,
      stagesPerWorkflow: MAX_STAGES_PER_WORKFLOW,
    },
    leao.ee.features.get('review-workflows')
  );
  const workflowsValidationService = getService('validation', { leao });
  workflowsValidationService.register(reviewWorkflowsOptions);
};
