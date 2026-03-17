import { join } from 'node:path';
import { Plop, run } from 'plop';
import nodePlop from 'node-plop';

/** Launch interactive Plop CLI for scaffolding APIs, content-types, etc. */
export const runCLI = () => {
  const plopfilePath = join(__dirname, '..', 'plopfile.js');
  Plop.launch({ configPath: plopfilePath }, (env) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    run({ ...env, dest: join(process.cwd(), 'src') } as any, undefined, true);
  });
};

/** Run a generator programmatically without prompts. */
export const generate = async (
  generatorName: string,
  options: unknown,
  { dir = process.cwd(), plopFile = 'plopfile.js' } = {}
) => {
  const plop = nodePlop(join(__dirname, '..', plopFile), {
    destBasePath: join(dir, 'src'),
    force: false,
  });

  const generator = plop.getGenerator(generatorName);
  await generator.runActions(options, {
    onSuccess() {},
    onFailure() {},
    onComment() {},
  });
};
