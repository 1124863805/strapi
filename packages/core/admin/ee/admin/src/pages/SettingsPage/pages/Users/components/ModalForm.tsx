import type { FormLayoutInputProps } from '../../../../../../../../admin/src/types/forms';

export const FORM_INITIAL_VALUES = {
  ...(window.leao.features.isEnabled(window.leao.features.SSO)
    ? {
        useSSORegistration: true,
      }
    : {}),
};

export const ROLE_LAYOUT = [
  ...(window.leao.features.isEnabled(window.leao.features.SSO)
    ? [
        [
          {
            label: {
              id: 'Settings.permissions.users.form.sso',
              defaultMessage: 'Connect with SSO',
            },
            name: 'useSSORegistration',
            type: 'boolean' as const,
            size: 6,
          },
        ],
      ]
    : []),
] satisfies FormLayoutInputProps[][];
