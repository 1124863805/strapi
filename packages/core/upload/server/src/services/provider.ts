import { isFunction } from 'lodash/fp';
import { file as fileUtils } from '@leao/utils';
import type { Core } from '@leao/types';

import { Config, UploadableFile } from '../types';

export default ({ leao }: { leao: Core.Leao }) => ({
  async checkFileSize(file: UploadableFile) {
    const { sizeLimit } = leao.config.get<Config>('plugin::upload');
    await leao.plugin('upload').provider.checkFileSize(file, { sizeLimit });
  },

  async upload(file: UploadableFile) {
    if (isFunction(leao.plugin('upload').provider.uploadStream)) {
      file.stream = file.getStream();
      await leao.plugin('upload').provider.uploadStream(file);

      delete file.stream;

      if ('filepath' in file) {
        delete file.filepath;
      }
    } else {
      file.buffer = await fileUtils.streamToBuffer(file.getStream());
      await leao.plugin('upload').provider.upload(file);

      delete file.buffer;

      if ('filepath' in file) {
        delete file.filepath;
      }
    }
  },
});
