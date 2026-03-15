import path from 'node:path';
import dotenv from 'dotenv';
import { pathExists } from './files';

/**
 * This is the base of _any_ env set for a leao project,
 * to build a leao admin panel we require these env variables.
 */
interface DefaultEnv {
  ADMIN_PATH: string;
  LEAO_ADMIN_BACKEND_URL: string;
}

/**
 * @internal
 *
 * @description Load the .env file if it exists
 */
const loadEnv = async (cwd: string) => {
  const pathToEnv = path.resolve(cwd, '.env');

  if (await pathExists(pathToEnv)) {
    dotenv.config({ path: pathToEnv });
  }
};

/**
 * @internal
 *
 * @description Get all the environment variables that start with `LEAO_ADMIN_`
 */
const getLeaoAdminEnvVars = (defaultEnv: DefaultEnv): Record<string, string> => {
  return Object.keys(process.env)
    .filter((key) => key.toUpperCase().startsWith('LEAO_ADMIN_'))
    .reduce(
      (acc, key) => {
        acc[key] = process.env[key] as string;

        return acc;
      },
      defaultEnv as unknown as Record<string, string>
    );
};

export { getLeaoAdminEnvVars, loadEnv };
