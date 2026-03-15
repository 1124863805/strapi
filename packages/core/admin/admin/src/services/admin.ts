import {
  type Init,
  type Information,
  type GetProjectSettings,
  type UpdateProjectSettings,
  type Plugins,
  type GetEEInfo,
} from '../../../shared/contracts/admin';
import { prefixFileUrlWithBackendUrl } from '../utils/urls';

import { adminApi } from './api';

interface ConfigurationLogo {
  custom?: {
    name?: string;
    url?: string;
  };
  default: string;
}

const admin = adminApi
  .enhanceEndpoints({
    addTagTypes: ['ProjectSettings', 'EEInfo'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      init: builder.query<Init.Response['data'], void>({
        query: () => ({
          url: '/admin/init',
          method: 'GET',
        }),
        transformResponse(res: Init.Response) {
          return res.data;
        },
      }),
      information: builder.query<Information.Response['data'], void>({
        query: () => ({
          url: '/admin/information',
          method: 'GET',
        }),
        transformResponse(res: Information.Response) {
          return res.data;
        },
      }),
      projectSettings: builder.query<
        { authLogo?: ConfigurationLogo['custom']; menuLogo?: ConfigurationLogo['custom'] },
        void
      >({
        query: () => ({
          url: '/admin/project-settings',
          method: 'GET',
        }),
        providesTags: ['ProjectSettings'],
        transformResponse(data: GetProjectSettings.Response) {
          return {
            authLogo: data.authLogo
              ? {
                  name: data.authLogo.name,
                  url: prefixFileUrlWithBackendUrl(data.authLogo.url),
                }
              : undefined,
            menuLogo: data.menuLogo
              ? {
                  name: data.menuLogo.name,
                  url: prefixFileUrlWithBackendUrl(data.menuLogo.url),
                }
              : undefined,
          };
        },
      }),
      updateProjectSettings: builder.mutation<UpdateProjectSettings.Response, FormData>({
        query: (data) => ({
          url: '/admin/project-settings',
          method: 'POST',
          data,
          config: {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          },
        }),
        invalidatesTags: ['ProjectSettings'],
      }),
      getPlugins: builder.query<Plugins.Response, void>({
        query: () => ({
          url: '/admin/plugins',
          method: 'GET',
        }),
      }),
      getEEInfo: builder.query<GetEEInfo.Response, void>({
        query: () => ({
          url: '/admin/ee-info',
          method: 'GET',
        }),
        providesTags: ['EEInfo'],
      }),
    }),
    overrideExisting: false,
  });

const {
  useInitQuery,
  useInformationQuery,
  useProjectSettingsQuery,
  useUpdateProjectSettingsMutation,
  useGetPluginsQuery,
  useGetEEInfoQuery,
} = admin;

export {
  useInitQuery,
  useInformationQuery,
  useProjectSettingsQuery,
  useUpdateProjectSettingsMutation,
  useGetPluginsQuery,
  useGetEEInfoQuery,
};

export type { ConfigurationLogo };
