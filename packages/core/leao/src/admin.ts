import { RenderAdminArgs, renderAdmin } from '@leao/admin/leao-admin';
import contentTypeBuilder from '@leao/content-type-builder/leao-admin';
import contentManager from '@leao/content-manager/leao-admin';
import email from '@leao/email/leao-admin';
// @ts-expect-error – no declaration file for @leao/upload/leao-admin
import upload from '@leao/upload/leao-admin';
import i18n from '@leao/i18n/leao-admin';
import contentReleases from '@leao/content-releases/leao-admin';
import reviewWorkflows from '@leao/review-workflows/leao-admin';

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

export * from '@leao/admin/leao-admin';

export {
  unstable_useDocumentLayout,
  unstable_useDocumentActions,
  unstable_useDocument,
  unstable_useContentManagerContext,
  useDocumentRBAC,
} from '@leao/content-manager/leao-admin';

export {
  private_useAutoReloadOverlayBlocker,
  private_AutoReloadOverlayBlockerProvider,
} from '@leao/content-type-builder/leao-admin';
