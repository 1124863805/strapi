import compress from 'koa-compress';
import type { Core } from '@leao/types';

export type Config = compress.CompressOptions;

export const compression: Core.MiddlewareFactory<Config> = (config) => compress(config);
