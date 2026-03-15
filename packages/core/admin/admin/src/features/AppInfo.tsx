import { createContext } from '../components/Context';

interface AppInfoContextValue {
  autoReload?: boolean;
  communityEdition?: boolean;
  currentEnvironment?: string;
  dependencies?: Record<string, string>;
  latestLeaoReleaseTag?: string;
  nodeVersion?: string;
  projectId?: string | null;
  shouldUpdateLeao?: boolean;
  leaoVersion?: string | null;
  useYarn?: boolean;
  userId?: string;
}

const [AppInfoProvider, useAppInfo] = createContext<AppInfoContextValue>('AppInfo', {});

export { AppInfoProvider, useAppInfo };

export type { AppInfoContextValue };
