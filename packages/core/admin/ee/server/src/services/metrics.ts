import { assign } from 'lodash/fp';
import type { Core } from '@leao/types';
import { getService } from '../utils';

const getSSOProvidersList = async () => {
  const { providerRegistry } = leao.service('admin::passport');

  return providerRegistry.getAll().map(({ uid }: { uid: string }) => uid);
};

const sendUpdateProjectInformation = async (leao: Core.Leao) => {
  let groupProperties = {};

  const numberOfActiveAdminUsers = await getService('user').count({ isActive: true });
  const numberOfAdminUsers = await getService('user').count();

  if (leao.ee.features.isEnabled('sso')) {
    const SSOProviders = await getSSOProvidersList();

    groupProperties = assign(groupProperties, {
      SSOProviders,
      isSSOConfigured: SSOProviders.length !== 0,
    });
  }

  if (leao.ee.features.isEnabled('cms-content-releases')) {
    const numberOfContentReleases = await leao
      .db!.query('plugin::content-releases.release')
      .count();

    const numberOfPublishedContentReleases = await leao
      .db!.query('plugin::content-releases.release')
      .count({
        filters: { releasedAt: { $notNull: true } },
      });

    groupProperties = assign(groupProperties, {
      numberOfContentReleases,
      numberOfPublishedContentReleases,
    });
  }

  groupProperties = assign(groupProperties, { numberOfActiveAdminUsers, numberOfAdminUsers });

  leao.telemetry.send('didUpdateProjectInformation', {
    groupProperties,
  });
};

const startCron = (leao: Core.Leao) => {
  leao.cron.add({
    sendProjectInformation: {
      task: () => sendUpdateProjectInformation(leao),
      options: '0 0 0 * * *',
    },
  });
};

export default { startCron, getSSOProvidersList, sendUpdateProjectInformation };
