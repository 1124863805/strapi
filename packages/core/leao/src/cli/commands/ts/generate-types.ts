import { createCommand } from 'commander';
import tsUtils from '@leao1/typescript-utils';
import { createLeao, compileLeao } from '@leao1/core';

import type { LeaoCommand } from '../../types';
import { runAction } from '../../utils/helpers';

interface CmdOptions {
  debug?: boolean;
  silent?: boolean;
  verbose?: boolean;
  outDir?: string;
}

const action = async ({ debug, silent, verbose, outDir }: CmdOptions) => {
  if ((debug || verbose) && silent) {
    console.error('Flags conflict: both silent and debug mode are enabled, exiting...');
    process.exit(1);
  }

  const appContext = await compileLeao({ ignoreDiagnostics: true });
  const app = await createLeao(appContext).register();

  await tsUtils.generators.generate({
    leao: app,
    pwd: appContext.appDir,
    rootDir: outDir ?? undefined,
    logger: {
      silent,
      debug,
    },
    artifacts: { contentTypes: true, components: true },
  });

  await app.destroy();
};

/**
 * `$ leao ts:generate-types`
 */
const command: LeaoCommand = () => {
  return createCommand('ts:generate-types')
    .description(`Generate TypeScript typings for your schemas`)
    .option('-d, --debug', `Run the generation with debug messages`, false)
    .option('-s, --silent', `Run the generation silently, without any output`, false)
    .option(
      '-o, --out-dir <outDir>',
      'Specify a relative root directory in which the definitions will be generated. Changing this value might break types exposed by Leao that relies on generated types.'
    )
    .action(runAction('ts:generate-types', action));
};

export { action, command };
