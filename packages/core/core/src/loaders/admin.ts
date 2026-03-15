import _ from 'lodash';
import type { Core, Struct } from '@leao1/types';
import { getGlobalId } from '../domain/content-type';

export default async function loadAdmin(leao: Core.Leao) {
  // leao.admin = require('@leao1/admin/leao-server');

  leao.get('services').add(`admin::`, leao.admin?.services);
  leao.get('controllers').add(`admin::`, leao.admin?.controllers);
  leao.get('content-types').add(`admin::`, formatContentTypes(leao.admin?.contentTypes ?? {}));
  leao.get('policies').add(`admin::`, leao.admin?.policies);
  leao.get('middlewares').add(`admin::`, leao.admin?.middlewares);

  const userAdminConfig = leao.config.get('admin');
  leao.get('config').set('admin', _.merge(leao.admin?.config, userAdminConfig));
}

const formatContentTypes = (contentTypes: Record<string, { schema: Struct.ContentTypeSchema }>) => {
  Object.values(contentTypes).forEach((definition) => {
    const { schema } = definition;

    Object.assign(schema, {
      plugin: 'admin',
      globalId: getGlobalId(schema, 'admin'),
    });
  });

  return contentTypes;
};
