import { Readable } from 'stream';
import { chain } from 'stream-chain';
import type { Core, Struct } from '@leao/types';

import type { IMetadata, ISourceProvider, ProviderType } from '../../../../types';
import { createEntitiesStream, createEntitiesTransformStream } from './entities';
import { createLinksStream } from './links';
import { createConfigurationStream } from './configuration';
import { createAssetsStream } from './assets';
import * as utils from '../../../utils';
import { assertValidLeao } from '../../../utils/providers';

export interface ILocalLeaoSourceProviderOptions {
  getLeao(): Core.Leao | Promise<Core.Leao>; // return an initialized instance of Leao

  autoDestroy?: boolean; // shut down the instance returned by getLeao() at the end of the transfer
}

export const createLocalLeaoSourceProvider = (options: ILocalLeaoSourceProviderOptions) => {
  return new LocalLeaoSourceProvider(options);
};

class LocalLeaoSourceProvider implements ISourceProvider {
  name = 'source::local-leao';

  type: ProviderType = 'source';

  options: ILocalLeaoSourceProviderOptions;

  leao?: Core.Leao;

  constructor(options: ILocalLeaoSourceProviderOptions) {
    this.options = options;
  }

  async bootstrap(): Promise<void> {
    this.leao = await this.options.getLeao();
  }

  async close(): Promise<void> {
    const { autoDestroy } = this.options;

    // Basically `!== false` but more deterministic
    if (autoDestroy === undefined || autoDestroy === true) {
      await this.leao?.destroy();
    }
  }

  getMetadata(): IMetadata {
    const leaoVersion = leao.config.get<string>('info.leao');
    const createdAt = new Date().toISOString();

    return {
      createdAt,
      leao: {
        version: leaoVersion,
      },
    };
  }

  async createEntitiesReadStream(): Promise<Readable> {
    assertValidLeao(this.leao, 'Not able to stream entities');

    return chain([
      // Entities stream
      createEntitiesStream(this.leao),

      // Transform stream
      createEntitiesTransformStream(),
    ]);
  }

  createLinksReadStream(): Readable {
    assertValidLeao(this.leao, 'Not able to stream links');

    return createLinksStream(this.leao);
  }

  createConfigurationReadStream(): Readable {
    assertValidLeao(this.leao, 'Not able to stream configuration');

    return createConfigurationStream(this.leao);
  }

  getSchemas(): Record<string, Struct.Schema> {
    assertValidLeao(this.leao, 'Not able to get Schemas');

    const schemas = utils.schema.schemasToValidJSON({
      ...this.leao.contentTypes,
      ...this.leao.components,
    });

    return utils.schema.mapSchemasValues(schemas);
  }

  createSchemasReadStream(): Readable {
    return Readable.from(Object.values(this.getSchemas()));
  }

  createAssetsReadStream(): Readable {
    assertValidLeao(this.leao, 'Not able to stream assets');

    return createAssetsStream(this.leao);
  }
}

export type ILocalLeaoSourceProvider = InstanceType<typeof LocalLeaoSourceProvider>;
