import { Writable } from 'stream';
import { omit } from 'lodash/fp';
import chalk from 'chalk';
import type { Core } from '@leao/types';
import { ProviderTransferError } from '../../../../../errors/providers';
import { IConfiguration, Transaction } from '../../../../../../types';

const omitInvalidCreationAttributes = omit(['id']);

const restoreCoreStore = async <T extends { value: unknown }>(leao: Core.Leao, values: T) => {
  const data = omitInvalidCreationAttributes(values);
  return leao.db.query('leao::core-store').create({
    data: {
      ...data,
      value: JSON.stringify(data.value),
    },
  });
};

const restoreWebhooks = async <T extends { value: unknown }>(leao: Core.Leao, values: T) => {
  const data = omitInvalidCreationAttributes(values);
  return leao.db.query('leao::webhook').create({ data });
};

export const restoreConfigs = async (leao: Core.Leao, config: IConfiguration) => {
  if (config.type === 'core-store') {
    return restoreCoreStore(leao, config.value as { value: unknown });
  }

  if (config.type === 'webhook') {
    return restoreWebhooks(leao, config.value as { value: unknown });
  }
};

export const createConfigurationWriteStream = async (
  leao: Core.Leao,
  transaction?: Transaction
) => {
  return new Writable({
    objectMode: true,
    async write<T extends { id: number }>(
      config: IConfiguration<T>,
      _encoding: BufferEncoding,
      callback: (error?: Error | null) => void
    ) {
      await transaction?.attach(async () => {
        try {
          await restoreConfigs(leao, config);
        } catch (error) {
          return callback(
            new ProviderTransferError(
              `Failed to import ${chalk.yellowBright(config.type)} (${chalk.greenBright(
                config.value.id
              )}`
            )
          );
        }
        callback();
      });
    },
  });
};
