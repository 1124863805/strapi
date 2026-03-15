import { errors, async } from '@leao1/utils';

import type { Core, Internal, Struct, Modules } from '@leao1/types';

import _ from 'lodash/fp';

import { RELEASE_ACTION_MODEL_UID, RELEASE_MODEL_UID } from '../constants';

import type {
  CreateReleaseAction,
  GetReleaseActions,
  ReleaseAction,
  ReleaseActionGroupBy,
  UpdateReleaseAction,
  DeleteReleaseAction,
} from '../../../shared/contracts/release-actions';
import type { Entity } from '../../../shared/types';
import { getService, getDraftEntryValidStatus, getEntry, getEntryStatus } from '../utils';

const getGroupName = (queryValue: string) => {
  switch (queryValue) {
    case 'contentType':
      return 'contentType.displayName';
    case 'type':
      return 'type';
    case 'locale':
      return _.getOr('No locale', 'locale.name');
    default:
      return 'contentType.displayName';
  }
};

export interface Locale extends Entity {
  name: string;
  code: string;
}

type LocaleDictionary = {
  [key: Locale['code']]: Pick<Locale, 'name' | 'code'>;
};

const createReleaseActionService = ({ leao }: { leao: Core.Leao }) => {
  const getLocalesDataForActions = async () => {
    if (!leao.plugin('i18n')) {
      return {};
    }

    const allLocales: Locale[] = (await leao.plugin('i18n').service('locales').find()) || [];
    return allLocales.reduce<LocaleDictionary>((acc, locale) => {
      acc[locale.code] = { name: locale.name, code: locale.code };

      return acc;
    }, {});
  };

  const getContentTypesDataForActions = async (
    contentTypesUids: ReleaseAction['contentType'][]
  ) => {
    const contentManagerContentTypeService = leao
      .plugin('content-manager')
      .service('content-types');

    const contentTypesData: Record<
      Internal.UID.ContentType,
      { mainField: string; displayName: string }
    > = {};
    for (const contentTypeUid of contentTypesUids) {
      const contentTypeConfig = await contentManagerContentTypeService.findConfiguration({
        uid: contentTypeUid,
      });

      contentTypesData[contentTypeUid] = {
        mainField: contentTypeConfig.settings.mainField,
        displayName: leao.getModel(contentTypeUid).info.displayName,
      };
    }

    return contentTypesData;
  };

  return {
    async create(
      releaseId: CreateReleaseAction.Request['params']['releaseId'],
      action: CreateReleaseAction.Request['body'],
      { disableUpdateReleaseStatus = false }: { disableUpdateReleaseStatus?: boolean } = {}
    ) {
      const { validateEntryData, validateUniqueEntry } = getService('release-validation', {
        leao,
      });

      await Promise.all([
        validateEntryData(action.contentType, action.entryDocumentId),
        validateUniqueEntry(releaseId, action),
      ]);

      // If we are adding a singleType, we need to append the documentId of that singleType
      const model = leao.contentType(action.contentType);
      if (model.kind === 'singleType') {
        const document = await leao.db.query(model.uid).findOne({ select: ['documentId'] });

        if (!document) {
          throw new errors.NotFoundError(`No entry found for contentType ${action.contentType}`);
        }

        action.entryDocumentId = document.documentId;
      }

      const release = await leao.db
        .query(RELEASE_MODEL_UID)
        .findOne({ where: { id: releaseId } });

      if (!release) {
        throw new errors.NotFoundError(`No release found for id ${releaseId}`);
      }

      if (release.releasedAt) {
        throw new errors.ValidationError('Release already published');
      }

      // If the action is a publish, check if the entry is valid
      // If the action is an unpublish, skip the validation
      const actionStatus =
        action.type === 'publish'
          ? await getDraftEntryValidStatus(
              {
                contentType: action.contentType,
                documentId: action.entryDocumentId,
                locale: action.locale,
              },
              {
                leao,
              }
            )
          : true;

      const releaseAction = await leao.db.query(RELEASE_ACTION_MODEL_UID).create({
        data: {
          ...action,
          release: release.id,
          isEntryValid: actionStatus,
        },
        populate: { release: { select: ['id'] } },
      });

      if (!disableUpdateReleaseStatus) {
        getService('release', { leao }).updateReleaseStatus(release.id);
      }

      return releaseAction;
    },

    async findPage(
      releaseId: GetReleaseActions.Request['params']['releaseId'],
      query?: GetReleaseActions.Request['query']
    ) {
      const release = await leao.db.query(RELEASE_MODEL_UID).findOne({
        where: { id: releaseId },
        select: ['id'],
      });

      if (!release) {
        throw new errors.NotFoundError(`No release found for id ${releaseId}`);
      }

      const dbQuery = leao.get('query-params').transform(RELEASE_ACTION_MODEL_UID, query ?? {});
      const { results: actions, pagination } = await leao.db
        .query(RELEASE_ACTION_MODEL_UID)
        .findPage({
          ...dbQuery,
          where: {
            release: releaseId,
          },
        });

      // For each contentType on the release, we create a custom populate object for nested relations
      const populateBuilderService = leao.plugin('content-manager').service('populate-builder');

      const actionsWithEntry = await async.map(actions, async (action: ReleaseAction) => {
        // @ts-expect-error - Core.Service type is not a function
        const populate = await populateBuilderService(action.contentType)
          .populateDeep(Infinity)
          .build();

        const entry = await getEntry(
          {
            contentType: action.contentType,
            documentId: action.entryDocumentId,
            locale: action.locale,
            populate,
            status: action.type === 'publish' ? 'draft' : 'published',
          },
          { leao }
        );

        return {
          ...action,
          entry,
          status: entry ? await getEntryStatus(action.contentType, entry) : null,
        };
      });

      return {
        results: actionsWithEntry,
        pagination,
      };
    },

    async groupActions(actions: ReleaseAction[], groupBy: ReleaseActionGroupBy) {
      const contentTypeUids = actions.reduce<ReleaseAction['contentType'][]>((acc, action) => {
        if (!acc.includes(action.contentType)) {
          acc.push(action.contentType);
        }

        return acc;
      }, []);
      const allReleaseContentTypesDictionary = await getContentTypesDataForActions(contentTypeUids);
      const allLocalesDictionary = await getLocalesDataForActions();

      const formattedData = actions.map((action: ReleaseAction) => {
        const { mainField, displayName } = allReleaseContentTypesDictionary[action.contentType];

        return {
          ...action,
          locale: action.locale ? allLocalesDictionary[action.locale] : null,
          contentType: {
            displayName,
            mainFieldValue: action.entry[mainField],
            uid: action.contentType,
          },
        };
      });

      const groupName = getGroupName(groupBy);
      return _.groupBy(groupName)(formattedData);
    },

    getContentTypeModelsFromActions(actions: ReleaseAction[]) {
      const contentTypeUids = actions.reduce<ReleaseAction['contentType'][]>((acc, action) => {
        if (!acc.includes(action.contentType)) {
          acc.push(action.contentType);
        }

        return acc;
      }, []);

      const contentTypeModelsMap = contentTypeUids.reduce(
        (
          acc: { [key: ReleaseAction['contentType']]: Struct.ContentTypeSchema },
          contentTypeUid: ReleaseAction['contentType']
        ) => {
          acc[contentTypeUid] = leao.getModel(contentTypeUid);

          return acc;
        },
        {}
      );

      return contentTypeModelsMap;
    },

    async countActions(
      query: Modules.EntityService.Params.Pick<typeof RELEASE_ACTION_MODEL_UID, 'filters'>
    ) {
      const dbQuery = leao.get('query-params').transform(RELEASE_ACTION_MODEL_UID, query ?? {});

      return leao.db.query(RELEASE_ACTION_MODEL_UID).count(dbQuery);
    },

    async update(
      actionId: UpdateReleaseAction.Request['params']['actionId'],
      releaseId: UpdateReleaseAction.Request['params']['releaseId'],
      update: UpdateReleaseAction.Request['body']
    ) {
      const action = await leao.db.query(RELEASE_ACTION_MODEL_UID).findOne({
        where: {
          id: actionId,
          release: {
            id: releaseId,
            releasedAt: {
              $null: true,
            },
          },
        },
      });

      if (!action) {
        throw new errors.NotFoundError(
          `Action with id ${actionId} not found in release with id ${releaseId} or it is already published`
        );
      }

      const actionStatus =
        update.type === 'publish'
          ? await getDraftEntryValidStatus(
              {
                contentType: action.contentType,
                documentId: action.entryDocumentId,
                locale: action.locale,
              },
              {
                leao,
              }
            )
          : true;

      const updatedAction = await leao.db.query(RELEASE_ACTION_MODEL_UID).update({
        where: {
          id: actionId,
          release: {
            id: releaseId,
            releasedAt: {
              $null: true,
            },
          },
        },
        data: {
          ...update,
          isEntryValid: actionStatus,
        },
      });

      getService('release', { leao }).updateReleaseStatus(releaseId);

      return updatedAction;
    },

    async delete(
      actionId: DeleteReleaseAction.Request['params']['actionId'],
      releaseId: DeleteReleaseAction.Request['params']['releaseId']
    ) {
      const deletedAction = await leao.db.query(RELEASE_ACTION_MODEL_UID).delete({
        where: {
          id: actionId,
          release: {
            id: releaseId,
            releasedAt: {
              $null: true,
            },
          },
        },
      });

      if (!deletedAction) {
        throw new errors.NotFoundError(
          `Action with id ${actionId} not found in release with id ${releaseId} or it is already published`
        );
      }

      getService('release', { leao }).updateReleaseStatus(releaseId);

      return deletedAction;
    },
  };
};

export type ReleaseActionService = ReturnType<typeof createReleaseActionService>;

export default createReleaseActionService;
