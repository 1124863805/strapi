import type { Core } from '@leao/types';

const getProviderName = () => leao.config.get('plugin::upload.provider', 'local');
const isProviderPrivate = async () => leao.plugin('upload').provider.isPrivate();

export default ({ leao }: { leao: Core.Leao }) => ({
  async sendUploadPluginMetrics() {
    const uploadProvider = getProviderName();
    const privateProvider = await isProviderPrivate();

    leao.telemetry.send('didInitializePluginUpload', {
      groupProperties: {
        uploadProvider,
        privateProvider,
      },
    });
  },
});
