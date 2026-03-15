import type { Core } from '@leao/types';
import executeCEDestroy from '../../../server/src/destroy';

export default async ({ leao }: { leao: Core.Leao }) => {
  await executeCEDestroy();
};
