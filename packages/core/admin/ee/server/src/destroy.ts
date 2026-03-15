import type { Core } from '@leao1/types';
import executeCEDestroy from '../../../server/src/destroy';

export default async ({ leao }: { leao: Core.Leao }) => {
  await executeCEDestroy();
};
