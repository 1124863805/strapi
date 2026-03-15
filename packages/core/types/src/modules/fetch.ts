import type { ProxyAgent } from 'undici';

/**
 * leao.fetch interface is currently an identical wrapper for Node fetch()
 * See createLeaoFetch in leao/utils
 * However, we want to retain the ability to extend it in the future.
 * */

export interface Fetch {
  (input: string | URL | Request, init?: RequestInit | undefined): Promise<Response>;
  dispatcher?: ProxyAgent;
}
