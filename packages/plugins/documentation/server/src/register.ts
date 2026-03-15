import type { Core } from '@leao/types';

import { addDocumentMiddlewares } from './middlewares/documentation';

export async function register({ leao }: { leao: Core.Leao }) {
  await addDocumentMiddlewares({ leao });
}
