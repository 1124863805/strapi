import type { Core } from '@leao1/types';
import { getService } from '../utils';

const controller: Core.Controller = {
  listIsoLocales(ctx) {
    const isoLocalesService = getService('iso-locales');

    ctx.body = isoLocalesService.getIsoLocales();
  },
};

export default controller;
