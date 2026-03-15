import type { Core, Modules } from '@leao/types';

const createCustomFields = (leao: Core.Leao): Modules.CustomFields.CustomFields => {
  return {
    register(customField) {
      leao.get('custom-fields').add(customField);
    },
  };
};

export default createCustomFields;
