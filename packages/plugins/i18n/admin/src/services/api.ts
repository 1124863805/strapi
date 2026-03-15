import { adminApi } from '@leao1/admin/leao-admin';

const i18nApi = adminApi.enhanceEndpoints({
  addTagTypes: ['Locale'],
});

export { i18nApi };
