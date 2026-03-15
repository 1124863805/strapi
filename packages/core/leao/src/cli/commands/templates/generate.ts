import { createCommand } from 'commander';

import type { LeaoCommand } from '../../types';

/**
 *`$ leao templates:generate <directory>`
 */
const command: LeaoCommand = () => {
  return createCommand('templates:generate <directory>')
    .description('(deprecated) Generate template from Leao project')
    .action(() => {
      console.warn('This command is deprecated and will be removed in the next major release.');
      console.warn('You can now copy an existing app and use it as a template.');
    });
};

export { command };
