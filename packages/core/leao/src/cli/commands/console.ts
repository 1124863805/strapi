import REPL from 'repl';
import { createCommand } from 'commander';
import { createLeao, compileLeao } from '@leao/core';

import type { LeaoCommand } from '../types';
import { runAction } from '../utils/helpers';

const action = async () => {
  const appContext = await compileLeao();
  const app = await createLeao(appContext).load();

  app.start().then(() => {
    const repl = REPL.start(app.config.info.name + ' > ' || 'leao > '); // eslint-disable-line prefer-template

    repl.on('exit', (err: Error) => {
      if (err) {
        app.log.error(err);
        process.exit(1);
      }

      app.server.destroy();
      process.exit(0);
    });
  });
};

/**
 * `$ leao console`
 */
const command: LeaoCommand = () => {
  return createCommand('console')
    .description('Open the Leao framework console')
    .action(runAction('console', action));
};

export { action, command };
