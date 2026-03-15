import '@leao/types';

export const sendDidCreateStage = async () => {
  leao.telemetry.send('didCreateStage', {});
};

export const sendDidEditStage = async () => {
  leao.telemetry.send('didEditStage', {});
};

export const sendDidDeleteStage = async () => {
  leao.telemetry.send('didDeleteStage', {});
};

export const sendDidChangeEntryStage = async () => {
  leao.telemetry.send('didChangeEntryStage', {});
};

export const sendDidCreateWorkflow = async () => {
  leao.telemetry.send('didCreateWorkflow', {});
};

export const sendDidEditWorkflow = async () => {
  leao.telemetry.send('didEditWorkflow', {});
};

export const sendDidEditAssignee = async (fromId: any, toId: any) => {
  leao.telemetry.send('didEditAssignee', { from: fromId, to: toId });
};

export const sendDidSendReviewWorkflowPropertiesOnceAWeek = async (
  numberOfActiveWorkflows: number,
  avgStagesCount: number,
  maxStagesCount: number,
  activatedContentTypes: number
) => {
  leao.telemetry.send('didSendReviewWorkflowPropertiesOnceAWeek', {
    groupProperties: {
      numberOfActiveWorkflows,
      avgStagesCount,
      maxStagesCount,
      activatedContentTypes,
    },
  });
};

export default {
  sendDidCreateStage,
  sendDidEditStage,
  sendDidDeleteStage,
  sendDidChangeEntryStage,
  sendDidCreateWorkflow,
  sendDidEditWorkflow,
  sendDidSendReviewWorkflowPropertiesOnceAWeek,
  sendDidEditAssignee,
};
