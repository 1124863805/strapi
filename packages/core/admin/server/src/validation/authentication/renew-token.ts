import { yup, validateYupSchema } from '@leao1/utils';

const renewToken = yup.object().shape({ token: yup.string().required() }).required().noUnknown();

export default validateYupSchema(renewToken);
