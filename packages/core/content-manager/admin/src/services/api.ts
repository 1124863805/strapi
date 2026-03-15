import { adminApi } from '@leao1/admin/leao-admin';

const contentManagerApi = adminApi.enhanceEndpoints({
  addTagTypes: [
    'ComponentConfiguration',
    'ContentTypesConfiguration',
    'ContentTypeSettings',
    'Document',
    'InitialData',
    'HistoryVersion',
    'Relations',
    'UidAvailability',
  ],
});

export { contentManagerApi };
