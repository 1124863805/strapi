import { RenderAdminArgs, renderAdmin } from '@leao1/admin/leao-admin';
import contentTypeBuilder from '@leao1/content-type-builder/leao-admin';
import contentManager from '@leao1/content-manager/leao-admin';
import email from '@leao1/email/leao-admin';
// @ts-expect-error – no declaration file for @leao1/upload/leao-admin
import upload from '@leao1/upload/leao-admin';
import i18n from '@leao1/i18n/leao-admin';
import contentReleases from '@leao1/content-releases/leao-admin';
import reviewWorkflows from '@leao1/review-workflows/leao-admin';

const render = (mountNode: HTMLElement | null, { plugins, ...restArgs }: RenderAdminArgs) => {
  return renderAdmin(mountNode, {
    ...restArgs,
    plugins: {
      'content-manager': contentManager,
      'content-type-builder': contentTypeBuilder,
      email,
      upload,
      contentReleases,
      i18n,
      reviewWorkflows,
      ...plugins,
    },
  });
};

export { render as renderAdmin };
export type { RenderAdminArgs };

export * from '@leao1/admin/leao-admin';

export {
  unstable_useDocumentLayout,
  unstable_useDocumentActions,
  unstable_useDocument,
  unstable_useContentManagerContext,
  useDocumentRBAC,
} from '@leao1/content-manager/leao-admin';

export {
  private_useAutoReloadOverlayBlocker,
  private_AutoReloadOverlayBlockerProvider,
} from '@leao1/content-type-builder/leao-admin';
