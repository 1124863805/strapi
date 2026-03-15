import type { Internal, Schema } from '@leao/types';

import type { Context } from '../../types';

export default ({ leao }: Context) => ({
  buildComponentResolver({
    contentTypeUID,
    attributeName,
  }: {
    contentTypeUID: Internal.UID.ContentType;
    attributeName: string;
  }) {
    const { transformArgs } = leao.plugin('graphql').service('builders').utils;

    return async (parent: any, args: any, ctx: any) => {
      const contentType = leao.getModel(contentTypeUID);

      const { component: componentName } = contentType.attributes[
        attributeName
      ] as Schema.Attribute.Component;

      const component = leao.getModel(componentName);

      const transformedArgs = transformArgs(args, { contentType: component, usePagination: true });
      await leao.contentAPI.validate.query(transformedArgs, component, {
        auth: ctx?.state?.auth,
      });

      const sanitizedQuery = await leao.contentAPI.sanitize.query(transformedArgs, component, {
        auth: ctx?.state?.auth,
      });

      return leao.db?.query(contentTypeUID).load(parent, attributeName, sanitizedQuery);
    };
  },
});
