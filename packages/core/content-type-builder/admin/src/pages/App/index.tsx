/* eslint-disable import/no-default-export */
/* eslint-disable check-file/filename-naming-convention  */
/* eslint-disable check-file/no-index */
import { lazy, Suspense, useEffect, useRef } from 'react';

import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

import { antdThemeConfig } from '../../config/antdTheme';
import { Page, useGuidedTour, Layouts } from '@leao1/admin/leao-admin';
import { useIntl } from 'react-intl';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AutoReloadOverlayBlockerProvider } from '../../components/AutoReloadOverlayBlocker';
import { ContentTypeBuilderNav } from '../../components/ContentTypeBuilderNav/ContentTypeBuilderNav';
import DataManagerProvider from '../../components/DataManagerProvider/DataManagerProvider';
import { FormModalNavigationProvider } from '../../components/FormModalNavigationProvider/FormModalNavigationProvider';
import { PERMISSIONS } from '../../constants';
import { pluginId } from '../../pluginId';
import { RecursivePath } from '../RecursivePath/RecursivePath';

const ListView = lazy(() => import('../ListView/ListView'));

const App = () => {
  const { formatMessage } = useIntl();
  const title = formatMessage({
    id: `${pluginId}.plugin.name`,
    defaultMessage: 'Content Types Builder',
  });
  const startSection = useGuidedTour('App', (state) => state.startSection);
  const startSectionRef = useRef(startSection);

  useEffect(() => {
    if (startSectionRef.current) {
      startSectionRef.current('contentTypeBuilder');
    }
  }, []);

  return (
    <ConfigProvider locale={zhCN} theme={antdThemeConfig}>
      <Page.Protect permissions={PERMISSIONS.main}>
        <Page.Title>{title}</Page.Title>
        <AutoReloadOverlayBlockerProvider>
          <FormModalNavigationProvider>
            {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
            {/* @ts-ignore */}
            <DataManagerProvider>
              <div className="ctb-plugin-root" style={{ display: 'flex', flexDirection: 'column', flex: 1, minHeight: 0 }}>
                <Layouts.Root sideNav={<ContentTypeBuilderNav />}>
                <Layouts.Content>
                  <div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column', height: '100%' }}>
                    <Suspense fallback={<Page.Loading />}>
                      <Routes>
                      <Route
                        index
                        element={<Navigate to="content-types/create-content-type" replace />}
                      />
                      <Route path="content-types/:uid" element={<div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}><ListView /></div>} />
                      <Route path={`component-categories/:categoryUid/*`} element={<div style={{ flex: 1, minHeight: 0, display: 'flex', flexDirection: 'column' }}><RecursivePath /></div>} />
                      </Routes>
                    </Suspense>
                  </div>
                </Layouts.Content>
                </Layouts.Root>
              </div>
            </DataManagerProvider>
          </FormModalNavigationProvider>
        </AutoReloadOverlayBlockerProvider>
      </Page.Protect>
    </ConfigProvider>
  );
};

export default App;
