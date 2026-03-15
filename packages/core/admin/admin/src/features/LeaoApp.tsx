import { createContext } from '../components/Context';
import { RBAC } from '../core/apis/rbac';
import { Router } from '../core/apis/router';

import type { LeaoApp } from '../LeaoApp';

/* -------------------------------------------------------------------------------------------------
 * LeaoApp
 * -----------------------------------------------------------------------------------------------*/
interface LeaoAppContextValue
  extends Pick<
      LeaoApp,
      | 'customFields'
      | 'getPlugin'
      | 'getAdminInjectedComponents'
      | 'plugins'
      | 'runHookParallel'
      | 'runHookSeries'
    >,
    Pick<Router, 'menu' | 'settings'> {
  components: LeaoApp['library']['components'];
  fields: LeaoApp['library']['fields'];
  rbac: RBAC;
  runHookWaterfall: <TData>(
    name: Parameters<LeaoApp['runHookWaterfall']>[0],
    initialValue: TData
  ) => TData;
}

const [LeaoAppProvider, useLeaoApp] = createContext<LeaoAppContextValue>('LeaoApp');

export { LeaoAppProvider, useLeaoApp };
export type { LeaoAppContextValue };
