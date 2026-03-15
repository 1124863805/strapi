import { isNil } from 'lodash/fp';
import { getService } from '../utils';

export default {
  // NOTE: Overrides CE admin controller
  async getProjectType() {
    const flags = leao.config.get('admin.flags', {});
    try {
      return { data: { isEE: leao.EE, features: leao.ee.features.list(), flags } };
    } catch (err) {
      return { data: { isEE: false, features: [], flags } };
    }
  },

  async getEEInfo() {
    const permittedSeats = leao.ee.seats;
    const currentActiveUserCount = await getService('user').getCurrentActiveUserCount();
    const eeDisabledUsers = await getService('seat-enforcement').getDisabledUserList();
    const enforcementUserCount = eeDisabledUsers
      ? currentActiveUserCount + eeDisabledUsers.length
      : currentActiveUserCount;
    const shouldNotify = false;

    const data = {
      enforcementUserCount,
      currentActiveUserCount,
      permittedSeats,
      shouldNotify,
      shouldStopCreate: isNil(permittedSeats) ? false : currentActiveUserCount >= permittedSeats,
      features: leao.ee.features.list() ?? [],
    };

    return { data };
  },
};
