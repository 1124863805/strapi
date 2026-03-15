import { resolve } from 'path';
import { statSync, existsSync } from 'fs';
import { yup, importDefault } from '@leao1/utils';

import type { Core } from '@leao1/types';

const srcSchema = yup
  .object()
  .shape({
    bootstrap: yup.mixed().isFunction(),
    register: yup.mixed().isFunction(),
    destroy: yup.mixed().isFunction(),
  })
  .noUnknown();

const validateSrcIndex = (srcIndex: unknown) => {
  return srcSchema.validateSync(srcIndex, { strict: true, abortEarly: false });
};

export default (leao: Core.Leao) => {
  if (!existsSync(leao.dirs.dist.src)) {
    return;
  }

  const pathToSrcIndex = resolve(leao.dirs.dist.src, 'index.js');
  if (!existsSync(pathToSrcIndex) || statSync(pathToSrcIndex).isDirectory()) {
    return {};
  }

  const srcIndex = importDefault(pathToSrcIndex);

  try {
    validateSrcIndex(srcIndex);
  } catch (e) {
    if (e instanceof yup.ValidationError) {
      leao.stopWithError({ message: `Invalid file \`./src/index.js\`: ${e.message}` });
    }

    throw e;
  }

  leao.app = srcIndex;
};
