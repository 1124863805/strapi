import { Job } from 'node-schedule';
import { Core } from '@leao/types';

import { Release } from '../../shared/contracts/releases';
import { getService } from './utils';

export const destroy = async ({ leao }: { leao: Core.Leao }) => {
  const scheduledJobs: Map<Release['id'], Job> = getService('scheduling', {
    leao,
  }).getAll();

  for (const [, job] of scheduledJobs) {
    job.cancel();
  }
};
