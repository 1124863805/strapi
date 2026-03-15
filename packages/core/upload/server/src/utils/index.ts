import type upload from '../services/upload';
import type imageManipulation from '../services/image-manipulation';
import type apiUploadFolder from '../services/api-upload-folder';
import type provider from '../services/provider';
import type folder from '../services/folder';
import type file from '../services/file';
import type extensions from '../services/extensions';

type Services = {
  upload: ReturnType<typeof upload>;
  'image-manipulation': typeof imageManipulation;
  provider: ReturnType<typeof provider>;
  folder: typeof folder;
  file: typeof file;
  'api-upload-folder': typeof apiUploadFolder;
  extensions: typeof extensions;
};

export const getService = <TName extends keyof Services>(name: TName): Services[TName] => {
  return leao.plugin('upload').service<Services[TName]>(name);
};
