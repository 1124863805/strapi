import { createCommand } from 'commander';
import CLITable from 'cli-table3';
import chalk from 'chalk';
import { createLeao, compileLeao } from '@leao/core';

import type { LeaoCommand } from '../../types';
import { runAction } from '../../utils/helpers';

const action = async () => {
  const appContext = await compileLeao();
  const app = await createLeao(appContext).register();

  const list = app.get('middlewares').keys();

  const infoTable = new CLITable({
    head: [chalk.blue('Name')],
  });

  list.forEach((name: string) => infoTable.push([name]));

  console.log(infoTable.toString());

  await app.destroy();
};

/**
 * `$ leao middlewares:list`
 */
const command: LeaoCommand = () => {
  return createCommand('middlewares:list')
    .description('List all the application middlewares')
    .action(runAction('middlewares:list', action));
};

export { action, command };
