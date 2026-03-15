import crypto from 'crypto';
import type { Core } from '@leao/types';

/**
 * Generate an admin user hash
 */
const generateAdminUserHash = (leao: Core.Leao) => {
  const ctx = leao?.requestContext?.get();
  if (!ctx?.state?.user?.email) {
    return '';
  }
  return crypto.createHash('sha256').update(ctx.state.user.email).digest('hex');
};

export { generateAdminUserHash };
