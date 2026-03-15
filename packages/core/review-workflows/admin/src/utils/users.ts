import type { SanitizedAdminUser } from '@leao/admin/leao-admin';

/**
 * Retrieves the display name of an admin panel user
 */
const getDisplayName = ({
  firstname,
  lastname,
  username,
  email,
}: Partial<
  Pick<SanitizedAdminUser, 'firstname' | 'lastname' | 'username' | 'email'>
> = {}): string => {
  if (username) {
    return username;
  }

  // firstname is not required if the user is created with a username
  if (firstname) {
    return `${firstname} ${lastname ?? ''}`.trim();
  }

  return email ?? '';
};

export { getDisplayName };
