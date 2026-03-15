import * as React from 'react';

import { Box, Flex, SkipToContent } from '@leao/design-system';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useIntl } from 'react-intl';
import { Outlet } from 'react-router-dom';
import lt from 'semver/functions/lt';
import valid from 'semver/functions/valid';

import packageJSON from '../../../package.json';
import { GuidedTourModal } from '../components/GuidedTour/Modal';
import { useGuidedTour } from '../components/GuidedTour/Provider';
import { LeftMenu } from '../components/LeftMenu';
import { Onboarding } from '../components/Onboarding';
import { Page } from '../components/PageHelpers';
import { PluginsInitializer } from '../components/PluginsInitializer';
import { PrivateRoute } from '../components/PrivateRoute';
import { AppInfoProvider } from '../features/AppInfo';
import { useAuth } from '../features/Auth';
import { useConfiguration } from '../features/Configuration';
import { useMenu } from '../hooks/useMenu';
import { useInformationQuery } from '../services/admin';
import { hashAdminUserEmail } from '../utils/users';

const leaoVersion = packageJSON.version;

const AdminLayout = () => {
  const setGuidedTourVisibility = useGuidedTour(
    'AdminLayout',
    (state) => state.setGuidedTourVisibility
  );
  const { formatMessage } = useIntl();
  const userInfo = useAuth('AuthenticatedApp', (state) => state.user);
  const [userId, setUserId] = React.useState<string>();
  const { data: appInfo, isLoading: isLoadingAppInfo } = useInformationQuery();

  const tagName = leaoVersion;

  const userRoles = useAuth('AuthenticatedApp', (state) => state.user?.roles);

  React.useEffect(() => {
    if (userRoles) {
      const isUserSuperAdmin = userRoles.find(({ code }) => code === 'leao-super-admin');

      if (isUserSuperAdmin && appInfo?.autoReload) {
        setGuidedTourVisibility(true);
      }
    }
  }, [userRoles, appInfo?.autoReload, setGuidedTourVisibility]);

  React.useEffect(() => {
    hashAdminUserEmail(userInfo).then((id) => {
      if (id) {
        setUserId(id);
      }
    });
  }, [userInfo]);

  const {
    isLoading: isLoadingMenu,
    generalSectionLinks,
    pluginsSectionLinks,
  } = useMenu(checkLatestLeaoVersion(leaoVersion, tagName));
  const { showTutorials } = useConfiguration('Admin');

  // We don't need to wait for the release query to be fetched before rendering the plugins
  // however, we need the appInfos and the permissions
  if (isLoadingMenu || isLoadingAppInfo) {
    return <Page.Loading />;
  }

  return (
    <AppInfoProvider
      {...appInfo}
      userId={userId}
      latestLeaoReleaseTag={tagName}
      shouldUpdateLeao={checkLatestLeaoVersion(leaoVersion, tagName)}
    >
      <PluginsInitializer>
        <DndProvider backend={HTML5Backend}>
          <Box background="neutral100">
            <SkipToContent>
              {formatMessage({ id: 'skipToContent', defaultMessage: 'Skip to content' })}
            </SkipToContent>
            <Flex alignItems="flex-start">
              <LeftMenu
                generalSectionLinks={generalSectionLinks}
                pluginsSectionLinks={pluginsSectionLinks}
              />
              <Box flex={1}>
                <Outlet />
                <GuidedTourModal />
                {showTutorials && <Onboarding />}
              </Box>
            </Flex>
          </Box>
        </DndProvider>
      </PluginsInitializer>
    </AppInfoProvider>
  );
};

const PrivateAdminLayout = () => {
  return (
    <PrivateRoute>
      <AdminLayout />
    </PrivateRoute>
  );
};

const checkLatestLeaoVersion = (
  currentPackageVersion: string,
  latestPublishedVersion: string = ''
): boolean => {
  if (!valid(currentPackageVersion) || !valid(latestPublishedVersion)) {
    return false;
  }

  return lt(currentPackageVersion, latestPublishedVersion);
};

export { AdminLayout, PrivateAdminLayout };
