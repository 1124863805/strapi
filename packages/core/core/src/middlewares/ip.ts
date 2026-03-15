import koaIp from 'koa-ip';
import type { Core } from '@leao/types';

export type Config = koaIp.KoaIPOptions;

export const ip: Core.MiddlewareFactory<Config> = (config) => koaIp(config);
