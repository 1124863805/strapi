import type { Internal } from '@leao/types';

import type { Context } from '../../types';

export default ({ leao }: Context) => ({
  buildDynamicZoneResolver({
    contentTypeUID,
    attributeName,
  }: {
    contentTypeUID: Internal.UID.ContentType;
    attributeName: string;
  }) {
    return async (parent: any) => {
      return leao.db?.query(contentTypeUID).load(parent, attributeName);
    };
  },
});
