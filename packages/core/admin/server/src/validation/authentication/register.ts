import { yup, validateYupSchema } from '@leao1/utils';
import validators from '../common-validators';

const registrationSchema = yup
  .object()
  .shape({
    registrationToken: yup.string().required(),
    userInfo: yup
      .object()
      .shape({
        name: validators.name.required(),
        password: validators.password.required(),
      })
      .required()
      .noUnknown(),
  })
  .noUnknown();

const registrationInfoQuerySchema = yup
  .object()
  .shape({
    registrationToken: yup.string().required(),
  })
  .required()
  .noUnknown();

const adminRegistrationSchema = yup
  .object()
  .shape({
    email: validators.email.required(),
    name: validators.name.required(),
    companyName: validators.companyName.nullable(),
    password: validators.password.required(),
  })
  .required()
  .noUnknown();

export const validateRegistrationInput = validateYupSchema(registrationSchema);
export const validateRegistrationInfoQuery = validateYupSchema(registrationInfoQuerySchema);
export const validateAdminRegistrationInput = validateYupSchema(adminRegistrationSchema);

export default {
  validateRegistrationInput,
  validateRegistrationInfoQuery,
  validateAdminRegistrationInput,
};
