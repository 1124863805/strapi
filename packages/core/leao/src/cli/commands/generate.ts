import { createCommand } from 'commander';
import { assertCwdContainsLeaoProject } from '../utils/helpers';
import type { LeaoCommand } from '../types';

/**
 * `$ leao generate`
 */
const command: LeaoCommand = ({ argv }) => {
  return createCommand('generate')
    .description('Launch the interactive API generator')
    .action(() => {
      assertCwdContainsLeaoProject('generate');
      argv.splice(2, 1);

      // NOTE: this needs to be lazy loaded in order for plop to work correctly
      import('@leao1/core').then((core) => core.scaffoldRunCLI());
    });
};

export { command };
