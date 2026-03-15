import { createCommand } from 'commander';
import type { LeaoCommand } from '../types';

/**
 * `$ leao version`
 */

const command: LeaoCommand = () => {
  // load the Leao package.json to get version and other information
  return createCommand('version')
    .description('Output the version of Leao')
    .action(() => {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const { version } = require('../../../package.json');

      process.stdout.write(`${version}\n`);
      process.exit(0);
    });
};

export { command };
