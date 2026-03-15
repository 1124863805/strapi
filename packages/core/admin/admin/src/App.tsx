/**
 *
 * App.js
 *
 */
import { Suspense, useEffect } from 'react';

import { Outlet } from 'react-router-dom';

import { Page } from './components/PageHelpers';
import { Providers } from './components/Providers';
import { LANGUAGE_LOCAL_STORAGE_KEY } from './reducer';

import type { Store } from './core/store/configure';
import type { LeaoApp } from './LeaoApp';

interface AppProps {
  leao: LeaoApp;
  store: Store;
}

const App = ({ leao, store }: AppProps) => {
  useEffect(() => {
    const language = localStorage.getItem(LANGUAGE_LOCAL_STORAGE_KEY) || 'zh-Hans';

    if (language) {
      document.documentElement.lang = language;
    }
  }, []);

  return (
    <Providers leao={leao} store={store}>
      <Suspense fallback={<Page.Loading />}>
        <Outlet />
      </Suspense>
    </Providers>
  );
};

export { App };
export type { AppProps };
