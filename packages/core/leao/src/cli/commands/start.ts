import { createCommand } from 'commander';
import fs from 'fs';
import tsUtils from '@leao/typescript-utils';
import { createLeao } from '@leao/core';

import type { LeaoCommand } from '../types';
import { runAction } from '../utils/helpers';

const action = async () => {
  const appDir = process.cwd();

  const isTSProject = await tsUtils.isUsingTypeScript(appDir);

  const outDir = await tsUtils.resolveOutDir(appDir);
  const distDir = isTSProject ? outDir : appDir;

  const buildDirExists = fs.existsSync(outDir);
  if (isTSProject && !buildDirExists)
    throw new Error(
      `${outDir} directory not found. Please run the build command before starting your application`
    );

  createLeao({ appDir, distDir }).start();
};

/**
 * `$ leao start`
 */
const command: LeaoCommand = () => {
  return createCommand('start')
    .description('Start your Leao application')
    .action(runAction('start', action));
};

export { command };
