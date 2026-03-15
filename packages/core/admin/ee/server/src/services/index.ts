import auth from './auth';
import passport from './passport';
import role from './role';
import user from './user';
import seatEnforcement from './seat-enforcement';

export default {
  auth,
  passport,
  role,
  user,
  'seat-enforcement': seatEnforcement,
};
