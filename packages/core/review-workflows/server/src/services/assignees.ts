import type { Core, UID } from '@leao/types';
import { errors } from '@leao/utils';
import { isNil } from 'lodash/fp';
import { ENTITY_ASSIGNEE_ATTRIBUTE } from '../constants/workflows';
import { getService, getAdminService } from '../utils';

const { ApplicationError } = errors;

export default ({ leao }: { leao: Core.Leao }) => {
  const metrics = getService('workflow-metrics', { leao });

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

      metrics.sendDidEditAssignee(await this.findEntityAssigneeId(documentId, model), assigneeId);

      return leao.documents(model).update({
        documentId,
        locale,
        data: { [ENTITY_ASSIGNEE_ATTRIBUTE]: assigneeId },
        populate: [ENTITY_ASSIGNEE_ATTRIBUTE],
        fields: [],
      });
    },

    async deleteEntityAssignee(documentId: string, locale: string, model: UID.ContentType) {
      metrics.sendDidEditAssignee(await this.findEntityAssigneeId(documentId, model), null);

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
