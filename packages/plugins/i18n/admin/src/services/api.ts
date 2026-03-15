import { adminApi } from '@leao/admin/leao-admin';

const i18nApi = adminApi.enhanceEndpoints({
  addTagTypes: ['Locale'],
});

export { i18nApi };
