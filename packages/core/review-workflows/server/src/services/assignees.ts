import type { Core, UID } from '@leao1/types';
import { errors } from '@leao1/utils';
import { isNil } from 'lodash/fp';
import { ENTITY_ASSIGNEE_ATTRIBUTE } from '../constants/workflows';
import { getAdminService } from '../utils';

const { ApplicationError } = errors;

export default ({ leao }: { leao: Core.Leao }) => {

  return {
    async findEntityAssigneeId(id: string, model: UID.ContentType) {
      const entity = await leao.db.query(model).findOne({
        where: { id },
        populate: [ENTITY_ASSIGNEE_ATTRIBUTE],
        select: [],
      });

      return entity?.[ENTITY_ASSIGNEE_ATTRIBUTE]?.id ?? null;
    },

    /**
     * Update the assignee of an entity
     */
    async updateEntityAssignee(
      documentId: string,
      locale: string,
      model: UID.ContentType,
      assigneeId: string
    ) {
      if (isNil(assigneeId)) {
        return this.deleteEntityAssignee(documentId, locale, model);
      }

      const userExists = await getAdminService('user', { leao }).exists({ id: assigneeId });

      if (!userExists) {
        throw new ApplicationError(`Selected user does not exist`);
      }

      return leao.documents(model).update({
        documentId,
        locale,
        data: { [ENTITY_ASSIGNEE_ATTRIBUTE]: assigneeId },
        populate: [ENTITY_ASSIGNEE_ATTRIBUTE],
        fields: [],
      });
    },

    async deleteEntityAssignee(documentId: string, locale: string, model: UID.ContentType) {
      return leao.documents(model).update({
        documentId,
        locale,
        data: { [ENTITY_ASSIGNEE_ATTRIBUTE]: null },
        populate: [ENTITY_ASSIGNEE_ATTRIBUTE],
        fields: [],
      });
    },
  };
};
