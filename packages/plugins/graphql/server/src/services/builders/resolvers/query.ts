import { omit } from 'lodash/fp';
import type { Schema } from '@leao1/types';
import type { Context } from '../../types';

export default ({ leao }: Context) => ({
  buildQueriesResolvers({ contentType }: { contentType: Schema.ContentType }) {
    const { uid } = contentType;

    return {
      async findMany(parent: any, args: any, ctx: any) {
        await leao.contentAPI.validate.query(args, contentType, {
          auth: ctx?.state?.auth,
        });

        const sanitizedQuery = await leao.contentAPI.sanitize.query(args, contentType, {
          auth: ctx?.state?.auth,
        });

        return leao.documents!(uid).findMany({ status: 'published', ...sanitizedQuery });
      },

      async findFirst(parent: any, args: any, ctx: any) {
        await leao.contentAPI.validate.query(args, contentType, {
          auth: ctx?.state?.auth,
        });

        const sanitizedQuery = await leao.contentAPI.sanitize.query(args, contentType, {
          auth: ctx?.state?.auth,
        });

        return leao.documents!(uid).findFirst({ status: 'published', ...sanitizedQuery });
      },

      async findOne(parent: any, args: any, ctx: any) {
        const { documentId } = args;

        await leao.contentAPI.validate.query(args, contentType, {
          auth: ctx?.state?.auth,
        });

        const sanitizedQuery = await leao.contentAPI.sanitize.query(args, contentType, {
          auth: ctx?.state?.auth,
        });

        return leao.documents!(uid).findOne({
          status: 'published',
          ...omit(['id', 'documentId'], sanitizedQuery),
          documentId,
        });
      },
    };
  },
});
