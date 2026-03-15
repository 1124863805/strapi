import { yup, validateYupSchema } from '@leao/utils';

const providerOptionsUpdateSchema = yup.object().shape({
  autoRegister: yup.boolean().required(),
  defaultRole: yup
    .leaoID()
    .when('autoRegister', (value, initSchema) => {
      return value ? initSchema.required() : initSchema.nullable();
    })
    .test('is-valid-role', 'You must submit a valid default role', (roleId) => {
      if (roleId === null) {
        return true;
      }
      return leao.service('admin::role').exists({ id: roleId });
    }),
  ssoLockedRoles: yup
    .array()
    .nullable()
    .of(
      yup
        .leaoID()
        .test(
          'is-valid-role',
          'You must submit a valid role for the SSO Locked roles',
          (roleId) => {
            return leao.service('admin::role').exists({ id: roleId });
          }
        )
    ),
});

export const validateProviderOptionsUpdate = validateYupSchema(providerOptionsUpdateSchema);

export default {
  validateProviderOptionsUpdate,
};
