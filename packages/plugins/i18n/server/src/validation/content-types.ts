import { yup, validateYupSchema } from '@leao/utils';

import { get } from 'lodash/fp';

const validateGetNonLocalizedAttributesSchema = yup
  .object()
  .shape({
    model: yup.string().required(),
    id: yup.mixed().when('model', {
      is: (model: any) => get('kind', leao.contentType(model)) === 'singleType',
      then: yup.leaoID().nullable(),
      otherwise: yup.leaoID().required(),
    }),
    locale: yup.string().required(),
  })
  .noUnknown()
  .required();

const validateGetNonLocalizedAttributesInput = validateYupSchema(
  validateGetNonLocalizedAttributesSchema
);

export { validateGetNonLocalizedAttributesInput };
