// eslint-disable-next-line import/no-extraneous-dependencies
import { defineConfig } from '@leao1/pack-up';

export default defineConfig({
  bundles: [
    {
      source: './src/plopfile.ts',
      require: './dist/plopfile.js',
      import: './dist/plopfile.mjs',
    },
  ],
  runtime: 'node',
});
