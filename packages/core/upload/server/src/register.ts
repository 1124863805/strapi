import _ from 'lodash';

import { errors, file } from '@leao1/utils';
import type { Core } from '@leao1/types';

import registerUploadMiddleware from './middlewares/upload';
import spec from '../../documentation/content-api.json';
import type { Config, File, InputFile } from './types';

const { PayloadTooLargeError } = errors;
const { bytesToHumanReadable, kbytesToBytes } = file;

/**
 * Register upload plugin
 */
export async function register({ leao }: { leao: Core.Leao }) {
  leao.plugin('upload').provider = createProvider(leao.config.get<Config>('plugin::upload'));

  await registerUploadMiddleware({ leao });

  if (leao.plugin('graphql')) {
    const { installGraphqlExtension } = await import('./graphql.js');
    installGraphqlExtension({ leao });
  }

  if (leao.plugin('documentation')) {
    leao
      .plugin('documentation')
      .service('override')
      .registerOverride(spec, {
        pluginOrigin: 'upload',
        excludeFromGeneration: ['upload'],
      });
  }
}

const createProvider = (config: Config) => {
  const { providerOptions, actionOptions = {} } = config;

  const providerName = _.toLower(config.provider);
  let provider;

  let modulePath;
  try {
    modulePath = require.resolve(`@leao1/provider-upload-${providerName}`);
  } catch (error) {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 'MODULE_NOT_FOUND'
    ) {
      modulePath = providerName;
    } else {
      throw error;
    }
  }

  try {
    provider = require(modulePath);
  } catch (err) {
    const newError = new Error(`Could not load upload provider "${providerName}".`);

    if (err instanceof Error) {
      newError.stack = err.stack;
    }

    throw newError;
  }

  const providerInstance = provider.init(providerOptions);

  if (!providerInstance.delete) {
    throw new Error(`The upload provider "${providerName}" doesn't implement the delete method.`);
  }

  if (!providerInstance.upload && !providerInstance.uploadStream) {
    throw new Error(
      `The upload provider "${providerName}" doesn't implement the uploadStream nor the upload method.`
    );
  }

  if (!providerInstance.uploadStream) {
    process.emitWarning(
      `The upload provider "${providerName}" doesn't implement the uploadStream function. Leao will fallback on the upload method. Some performance issues may occur.`
    );
  }

  const wrappedProvider = _.mapValues(providerInstance, (method, methodName) => {
    return async (file: File, options = actionOptions[methodName]) =>
      providerInstance[methodName](file, options);
  });

  return Object.assign(Object.create(baseProvider), wrappedProvider);
};

const baseProvider = {
  extend(obj: unknown) {
    Object.assign(this, obj);
  },
  checkFileSize(file: InputFile, { sizeLimit }: { sizeLimit: number }) {
    if (sizeLimit && kbytesToBytes(file.size) > sizeLimit) {
      throw new PayloadTooLargeError(
        `${file.originalFilename} exceeds size limit of ${bytesToHumanReadable(sizeLimit)}.`
      );
    }
  },
  getSignedUrl(file: File) {
    return file;
  },
  isPrivate() {
    return false;
  },
};
