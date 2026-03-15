import type { Core, Modules } from '@leao1/types';
import { ProxyAgent } from 'undici';

// TODO: once core Node exposes a stable way to create a ProxyAgent we will use that instead of undici

// Create a wrapper for Node's Fetch API that applies a global proxy
export const createLeaoFetch = (leao: Core.Leao): Modules.Fetch.Fetch => {
  function leaoFetch(
    url: Parameters<Modules.Fetch.Fetch>[0],
    options?: Parameters<Modules.Fetch.Fetch>[1]
  ) {
    const fetchOptions = {
      ...(leaoFetch.dispatcher ? { dispatcher: leaoFetch.dispatcher } : {}),
      ...options,
    } as RequestInit;
    leao.log.debug(`Making request for ${url}`);
    return fetch(url, fetchOptions);
  }

  const proxy =
    leao.config.get<ConstructorParameters<typeof ProxyAgent>[0]>('server.proxy.fetch') ||
    leao.config.get<string>('server.proxy.global');

  if (proxy) {
    leao.log.info(`Using proxy for Fetch requests: ${proxy}`);
    leaoFetch.dispatcher = new ProxyAgent(proxy);
  }

  return leaoFetch;
};

export type Fetch = Modules.Fetch.Fetch;
