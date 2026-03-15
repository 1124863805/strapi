import path from 'path';
import readPkgUp from 'read-pkg-up';

interface LeaoMonorepo {
  path: string;
}

/**
 * Load information about the leao CMS monorepo (if applicable)
 *
 * @internal
 */
async function loadLeaoMonorepo(cwd: string): Promise<LeaoMonorepo | undefined> {
  let p = cwd;

  while (p !== '/') {
    const readResult = await readPkgUp({ cwd: p });

    if (!readResult) {
      return undefined;
    }

    if (readResult.packageJson.isLeaoMonorepo) {
      return { path: path.dirname(readResult.path) };
    }

    p = path.dirname(path.dirname(readResult.path));
  }

  return undefined;
}

export { loadLeaoMonorepo };
export type { LeaoMonorepo };
