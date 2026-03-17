import * as React from 'react';

import { SingleSelectOption, Field, Flex, Loader, Typography } from '@leao1/design-system';
import { useNotification, useAPIErrorHandler, useQueryParams } from '@leao1/admin/leao-admin';
import { unstable_useDocument } from '@leao1/content-manager/leao-admin';
import { SingleSelect } from '@leao1/design-system';
import { useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import { useGetStagesQuery, useUpdateStageMutation } from '../../../../../services/content-manager';
import { buildValidParams } from '../../../../../utils/api';
import { getStageColorByHex } from '../../../../../utils/colors';

import { STAGE_ATTRIBUTE_NAME } from './constants';

import type { Data } from '@leao1/types';

export const StageSelect = () => {
  const {
    collectionType = '',
    slug: model = '',
    id = '',
  } = useParams<{
    collectionType: string;
    slug: string;
    id: string;
  }>();
  const { formatMessage } = useIntl();
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler();
  const { toggleNotification } = useNotification();
  const [{ query }] = useQueryParams();
  const params = React.useMemo(() => buildValidParams(query), [query]);
  const { document, isLoading: isLoadingDocument } = unstable_useDocument(
    {
      collectionType,
      model,
      documentId: id,
    },
    {
      skip: !id && collectionType !== 'single-types',
    }
  );

  const { data, isLoading: isLoadingStages } = useGetStagesQuery(
    {
      slug: collectionType,
      model: model,
      // @ts-expect-error – `id` is not correctly typed in the DS.
      id: document?.documentId,
      params,
    },
    {
      skip: !document?.documentId,
    }
  );

  const { stages = [] } = data ?? {};
  const activeWorkflowStage = document ? document[STAGE_ATTRIBUTE_NAME] : null;
  const [updateStage, { error }] = useUpdateStageMutation();

  const handleChange = async (stageId: Data.ID) => {
    try {
      if (document?.documentId) {
        const res = await updateStage({
          model,
          id: document.documentId,
          slug: collectionType,
          params,
          data: { id: stageId },
        });

        if ('data' in res) {
          toggleNotification({
            type: 'success',
            message: formatMessage({
              id: 'content-manager.reviewWorkflows.stage.notification.saved',
              defaultMessage: 'Review stage updated',
            }),
          });
        }
      }
    } catch (error) {
      toggleNotification({
        type: 'danger',
        message: formatMessage({
          id: 'content-manager.reviewWorkflows.stage.notification.error',
          defaultMessage: 'An error occurred while updating the review stage',
        }),
      });
    }
  };

  const { themeColorName } = getStageColorByHex(activeWorkflowStage?.color) ?? {};

  const isLoading = isLoadingStages || isLoadingDocument;

  return (
    <>
      <Field.Root
        hint={
          !isLoading &&
          stages.length === 0 &&
          formatMessage({
            id: 'content-manager.reviewWorkflows.stages.no-transition',
            defaultMessage: "You don't have the permission to update this stage.",
          })
        }
        error={(error && formatAPIError(error)) || undefined}
        name={STAGE_ATTRIBUTE_NAME}
        id={STAGE_ATTRIBUTE_NAME}
      >
        <Field.Label>
          {formatMessage({
            id: 'content-manager.reviewWorkflows.stage.label',
            defaultMessage: 'Review stage',
          })}
        </Field.Label>
        <SingleSelect
          disabled={stages.length === 0}
          value={activeWorkflowStage?.id}
          onChange={handleChange}
          placeholder={formatMessage({
            id: 'content-manager.reviewWorkflows.assignee.placeholder',
            defaultMessage: 'Select…',
          })}
          startIcon={
            activeWorkflowStage && (
              <Flex
                tag="span"
                height={2}
                background={activeWorkflowStage?.color}
                borderColor={themeColorName === 'neutral0' ? 'neutral150' : undefined}
                hasRadius
                shrink={0}
                width={2}
                marginRight="-3px"
              />
            )
          }
          // @ts-expect-error – `customizeContent` is not correctly typed in the DS.
          customizeContent={() => {
            return (
              <Flex tag="span" justifyContent="space-between" alignItems="center" width="100%">
                <Typography textColor="neutral800" ellipsis>
                  {activeWorkflowStage?.name ?? ''}
                </Typography>
                {isLoading ? (
                  <Loader small style={{ display: 'flex' }} data-testid="loader" />
                ) : null}
              </Flex>
            );
          }}
        >
          {stages.map(({ id, color, name }) => {
            const { themeColorName } = getStageColorByHex(color) ?? {};

            return (
              <SingleSelectOption
                key={id}
                startIcon={
                  <Flex
                    height={2}
                    background={color}
                    borderColor={themeColorName === 'neutral0' ? 'neutral150' : undefined}
                    hasRadius
                    shrink={0}
                    width={2}
                  />
                }
                value={id}
                textValue={name}
              >
                {name}
              </SingleSelectOption>
            );
          })}
        </SingleSelect>
        <Field.Hint />
        <Field.Error />
      </Field.Root>
    </>
  );
};
