import { createCommand } from 'commander';
import CLITable from 'cli-table3';
import chalk from 'chalk';
import { createLeao, compileLeao } from '@leao1/core';

import type { LeaoCommand } from '../../types';
import { runAction } from '../../utils/helpers';

const action = async () => {
  const appContext = await compileLeao();
  const app = await createLeao(appContext).register();

  const list = Object.keys(app.components);

  const infoTable = new CLITable({
    head: [chalk.blue('Name')],
  });

  list.forEach((name) => infoTable.push([name]));

  console.log(infoTable.toString());

  await app.destroy();
};

/**
 * `$ leao components:list`
 */
const command: LeaoCommand = () => {
  return createCommand('components:list')
    .description('List all the application components')
    .action(runAction('components:list', action));
};

export { action, command };
