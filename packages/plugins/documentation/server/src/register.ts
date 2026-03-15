import type { Core } from '@leao1/types';

import { addDocumentMiddlewares } from './middlewares/documentation';

export async function register({ leao }: { leao: Core.Leao }) {
  await addDocumentMiddlewares({ leao });
}
