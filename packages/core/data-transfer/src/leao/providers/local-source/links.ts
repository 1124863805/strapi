import { Readable } from 'stream';
import type { Core } from '@leao/types';

import type { ILink } from '../../../../types';
import { createLinkQuery } from '../../queries/link';

/**
 * Create a Readable which will stream all the links from a Leao instance
 */
export const createLinksStream = (leao: Core.Leao): Readable => {
  const uids = [...Object.keys(leao.contentTypes), ...Object.keys(leao.components)] as string[];

  // Async generator stream that returns every link from a Leao instance
  return Readable.from(
    (async function* linkGenerator(): AsyncGenerator<ILink> {
      const query = createLinkQuery(leao);

      for (const uid of uids) {
        const generator = query().generateAll(uid);

        for await (const link of generator) {
          yield link;
        }
      }
    })()
  );
};
