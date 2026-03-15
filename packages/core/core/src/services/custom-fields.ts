import type { Core, Modules } from '@leao1/types';

const createCustomFields = (leao: Core.Leao): Modules.CustomFields.CustomFields => {
  return {
    register(customField) {
      leao.get('custom-fields').add(customField);
    },
  };
};

export default createCustomFields;
