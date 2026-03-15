import type { Core } from '@leao/types';

import executeCERegister from '../../../server/src/register';

export default async ({ leao }: { leao: Core.Leao }) => {
  await executeCERegister({ leao });
};
