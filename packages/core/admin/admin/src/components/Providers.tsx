import * as React from 'react';

import { QueryClient, QueryClientProvider } from 'react-query';
import { Provider } from 'react-redux';

import { AuthProvider } from '../features/Auth';
import { HistoryProvider } from '../features/BackButton';
import { ConfigurationProvider } from '../features/Configuration';
import { NotificationsProvider } from '../features/Notifications';
import { LeaoAppProvider } from '../features/LeaoApp';
import { TrackingProvider } from '../features/Tracking';

import { GuidedTourProvider } from './GuidedTour/Provider';
import { LanguageProvider } from './LanguageProvider';
import { Theme } from './Theme';

import type { Store } from '../core/store/configure';
import type { LeaoApp } from '../LeaoApp';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
  leao: LeaoApp;
  store: Store;
}

const Providers = ({ children, leao, store }: ProvidersProps) => {
  return (
    <LeaoAppProvider
      components={leao.library.components}
      customFields={leao.customFields}
      fields={leao.library.fields}
      menu={leao.router.menu}
      getAdminInjectedComponents={leao.getAdminInjectedComponents}
      getPlugin={leao.getPlugin}
      plugins={leao.plugins}
      rbac={leao.rbac}
      runHookParallel={leao.runHookParallel}
      runHookWaterfall={(name, initialValue) => leao.runHookWaterfall(name, initialValue, store)}
      runHookSeries={leao.runHookSeries}
      settings={leao.router.settings}
    >
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <HistoryProvider>
              <LanguageProvider messages={leao.configurations.translations}>
                <Theme themes={leao.configurations.themes}>
                  <NotificationsProvider>
                    <TrackingProvider>
                      <GuidedTourProvider>
                        <ConfigurationProvider
                          defaultAuthLogo={leao.configurations.authLogo}
                          defaultMenuLogo={leao.configurations.menuLogo}
                          showTutorials={leao.configurations.tutorials}
                          showReleaseNotification={leao.configurations.notifications.releases}
                        >
                          {children}
                        </ConfigurationProvider>
                      </GuidedTourProvider>
                    </TrackingProvider>
                  </NotificationsProvider>
                </Theme>
              </LanguageProvider>
            </HistoryProvider>
          </AuthProvider>
        </QueryClientProvider>
      </Provider>
    </LeaoAppProvider>
  );
};

export { Providers };
