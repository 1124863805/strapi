import { yup, validateYupSchema } from '@leao1/utils';
import { schemas } from '../../../../server/src/validation/user';

const ssoUserCreationInputExtension = yup
  .object()
  .shape({
    useSSORegistration: yup.boolean(),
  })
  .noUnknown();

export const validateUserCreationInput = (data: any) => {
  let schema = schemas.userCreationSchema;

  if (leao.ee.features.isEnabled('sso')) {
    schema = schema.concat(ssoUserCreationInputExtension);
  }

  return validateYupSchema(schema)(data);
};

export default {
  validateUserCreationInput,
};
