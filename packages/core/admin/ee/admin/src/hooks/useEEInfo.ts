import * as React from 'react';

import { useGetEEInfoQuery } from '../../../../admin/src/services/admin';
import { GetEEInfo } from '../../../../shared/contracts/admin';

interface UseEEInfoArgs {
  enabled?: boolean;
}

function useEEInfo({ enabled }: UseEEInfoArgs = { enabled: true }) {
  const { data, isError, isLoading } = useGetEEInfoQuery(undefined, {
    skip: !enabled,
  });

  type FeatureNames = GetEEInfo.Response['data']['features'][number]['name'];
  type GetFeatureType = <T>(name: FeatureNames) => Record<string, T> | undefined;

  const getFeature = React.useCallback<GetFeatureType>(
    (name) => {
      const feature = data?.data?.features.find((f) => f.name === name);
      return feature && 'options' in feature ? feature.options : {};
    },
    [data]
  );

  return { info: data?.data, getFeature, isError, isLoading };
}

export { useEEInfo };
export type { UseEEInfoArgs };
