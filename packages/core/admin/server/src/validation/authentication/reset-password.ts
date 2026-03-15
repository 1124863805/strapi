import { yup, validateYupSchema } from '@leao1/utils';
import validators from '../common-validators';

const resetPasswordSchema = yup
  .object()
  .shape({
    resetPasswordToken: yup.string().required(),
    password: validators.password.required(),
  })
  .required()
  .noUnknown();

export default validateYupSchema(resetPasswordSchema);
