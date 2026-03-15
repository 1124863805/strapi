import type { UID, Data, Core } from '@leao1/types';

import type { SettingsService } from '../services/settings';
import type { ReleaseService } from '../services/release';
import type { ReleaseActionService } from '../services/release-action';

type Services = {
  release: ReleaseService;
  'release-validation': any;
  scheduling: any;
  'release-action': ReleaseActionService;
  'event-manager': any;
  settings: SettingsService;
};

interface Action {
  contentType: UID.ContentType;
  documentId?: Data.DocumentID;
  locale?: string;
}

export const getService = <TName extends keyof Services>(
  name: TName,
  { leao }: { leao: Core.Leao }
): Services[TName] => {
  return leao.plugin('content-releases').service(name);
};

export const getDraftEntryValidStatus = async (
  { contentType, documentId, locale }: Action,
  { leao }: { leao: Core.Leao }
) => {
  const populateBuilderService = leao.plugin('content-manager').service('populate-builder');
  // @ts-expect-error - populateBuilderService should be a function but is returning service
  const populate = await populateBuilderService(contentType).populateDeep(Infinity).build();

  const entry = await getEntry({ contentType, documentId, locale, populate }, { leao });

  return isEntryValid(contentType, entry, { leao });
};

export const isEntryValid = async (
  contentTypeUid: string,
  entry: any,
  { leao }: { leao: Core.Leao }
) => {
  try {
    // @TODO: When documents service has validateEntityCreation method, use it instead
    await leao.entityValidator.validateEntityCreation(
      leao.getModel(contentTypeUid as UID.ContentType),
      entry,
      undefined,
      // @ts-expect-error - FIXME: entity here is unnecessary
      entry
    );

    return true;
  } catch {
    return false;
  }
};

export const getEntry = async (
  {
    contentType,
    documentId,
    locale,
    populate,
    status = 'draft',
  }: Action & { status?: 'draft' | 'published'; populate: any },
  { leao }: { leao: Core.Leao }
) => {
  if (documentId) {
    return leao.documents(contentType).findOne({ documentId, locale, populate, status });
  }

  return leao.documents(contentType).findFirst({ locale, populate, status });
};

export const getEntryStatus = async (contentType: UID.ContentType, entry: Data.ContentType) => {
  if (entry.publishedAt) {
    return 'published';
  }

  const publishedEntry = await leao.documents(contentType).findOne({
    documentId: entry.documentId,
    locale: entry.locale,
    status: 'published',
    fields: ['updatedAt'],
  });

  if (!publishedEntry) {
    return 'draft';
  }

  const entryUpdatedAt = new Date(entry.updatedAt).getTime();
  const publishedEntryUpdatedAt = new Date(publishedEntry.updatedAt).getTime();

  if (entryUpdatedAt > publishedEntryUpdatedAt) {
    return 'modified';
  }

  return 'published';
};
