import { join, extname, basename } from 'path';
import fse from 'fs-extra';
import { importDefault } from '@leao1/utils';
import type { Core } from '@leao1/types';
import { middlewares as internalMiddlewares } from '../middlewares';

// TODO:: allow folders with index.js inside for bigger policies
export default async function loadMiddlewares(leao: Core.Leao) {
  const localMiddlewares = await loadLocalMiddlewares(leao);

  leao.get('middlewares').add(`global::`, localMiddlewares);
  leao.get('middlewares').add(`leao::`, internalMiddlewares);
}

const loadLocalMiddlewares = async (leao: Core.Leao) => {
  const dir = leao.dirs.dist.middlewares;

  if (!(await fse.pathExists(dir))) {
    return {};
  }

  const middlewares: Record<string, Core.MiddlewareFactory> = {};
  const paths = await fse.readdir(dir, { withFileTypes: true });

  for (const fd of paths) {
    const { name } = fd;
    const fullPath = join(dir, name);

    if (fd.isFile() && extname(name) === '.js') {
      const key = basename(name, '.js');
      middlewares[key] = importDefault(fullPath);
    }
  }

  return middlewares;
};
