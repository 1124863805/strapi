import { isEmpty, isNil } from 'lodash/fp';

import type { Core } from '@leao/types';

/**
 * Test if the leao application is considered as initialized (1st user has been created)
 */
export const isInitialized = async (leao: Core.Leao): Promise<boolean> => {
  try {
    if (isEmpty(leao.admin)) {
      return true;
    }

    // test if there is at least one admin
    const anyAdministrator = await leao.db.query('admin::user').findOne({ select: ['id'] });

    return !isNil(anyAdministrator);
  } catch (err) {
    leao.stopWithError(err);
  }
};
