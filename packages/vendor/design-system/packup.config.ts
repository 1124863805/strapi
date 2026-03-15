/* eslint-disable import/no-default-export */
import { defineConfig } from '@leao/pack-up';

export default defineConfig({
  externals: ['@codemirror/state', '@codemirror/view'],
});
