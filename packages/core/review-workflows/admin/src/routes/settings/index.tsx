/* eslint-disable check-file/no-index */
/* eslint-disable check-file/filename-naming-convention */
import * as React from 'react';

import { Page, ConfirmDialog, useRBAC, Table } from '@leao1/admin/leao-admin';
import { Dialog, Flex, IconButton, LinkButton, TFooter, Typography } from '@leao1/design-system';
import { Pencil, Plus, Trash } from '@leao1/icons';
import { useIntl } from 'react-intl';
import { NavLink, Link, useNavigate } from 'react-router-dom';

import { useTypedSelector } from '../../modules/hooks';
import { ContentType, useGetContentTypesQuery } from '../../services/content-manager';

import * as Layout from './components/Layout';
import { useReviewWorkflows } from './hooks/useReviewWorkflows';

export const ReviewWorkflowsListView = () => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const [workflowToDelete, setWorkflowToDelete] = React.useState<string | null>(null);
  const { data, isLoading: isLoadingModels } = useGetContentTypesQuery();
  const { workflows, isLoading, delete: deleteAction } = useReviewWorkflows();
  const permissions = useTypedSelector(
    (state) => state.admin_app.permissions.settings?.['review-workflows']
  );
  const {
    allowedActions: { canCreate, canRead, canUpdate, canDelete },
  } = useRBAC(permissions);

  const handleDeleteWorkflow = (workflowId: string) => {
    setWorkflowToDelete(workflowId);
  };

  const toggleConfirmDeleteDialog = () => {
    setWorkflowToDelete(null);
  };

  const handleConfirmDeleteDialog = async () => {
    if (!workflowToDelete) return;

    await deleteAction(workflowToDelete);

    setWorkflowToDelete(null);
  };

  const headers = [
    {
      label: formatMessage({
        id: 'Settings.review-workflows.list.page.list.column.name.title',
        defaultMessage: '名称',
      }),
      name: 'name',
    },
    {
      label: formatMessage({
        id: 'Settings.review-workflows.list.page.list.column.stages.title',
        defaultMessage: '阶段',
      }),
      name: 'stages',
    },
    {
      label: formatMessage({
        id: 'Settings.review-workflows.list.page.list.column.contentTypes.title',
        defaultMessage: '内容类型',
      }),
      name: 'content-types',
    },
  ];

  if (isLoading || isLoadingModels) {
    return <Page.Loading />;
  }

  const contentTypes = Object.values(data ?? {}).reduce<ContentType[]>((acc, curr) => {
    acc.push(...curr);
    return acc;
  }, []);

  return (
    <>
      <Layout.Header
        primaryAction={
          canCreate ? (
            <LinkButton
              startIcon={<Plus />}
              size="S"
              tag={NavLink}
              to="create"
              onClick={() => navigate('create')}
            >
              {formatMessage({
                id: 'Settings.review-workflows.list.page.create',
                defaultMessage: '新建工作流',
              })}
            </LinkButton>
          ) : null
        }
        subtitle={formatMessage({
          id: 'Settings.review-workflows.list.page.subtitle',
          defaultMessage: '管理内容审核流程',
        })}
        title={formatMessage({
          id: 'Settings.review-workflows.list.page.title',
          defaultMessage: '审核工作流',
        })}
      />

      <Layout.Root>
        <Table.Root
          isLoading={isLoading}
          rows={workflows}
          footer={
            canCreate ? (
              <TFooter icon={<Plus />} onClick={() => navigate('create')}>
                {formatMessage({
                  id: 'Settings.review-workflows.list.page.create',
                  defaultMessage: '新建工作流',
                })}
              </TFooter>
            ) : null
          }
          headers={headers}
        >
          <Table.Content>
            <Table.Head>
              {headers.map((head) => (
                <Table.HeaderCell key={head.name} {...head} />
              ))}
            </Table.Head>

            <Table.Body>
              {workflows.map((workflow) => (
                <Table.Row
                  onClick={() => navigate(`${workflow.id}`)}
                  key={workflow.id}
                >
                  <Table.Cell width="25rem">
                    <Typography textColor="neutral800" fontWeight="bold" ellipsis>
                      {workflow.name}
                    </Typography>
                  </Table.Cell>
                  <Table.Cell>
                    <Typography textColor="neutral800">{workflow.stages.length}</Typography>
                  </Table.Cell>
                  <Table.Cell>
                    <Typography textColor="neutral800">
                      {workflow.contentTypes
                        .map((uid: string) => {
                          const contentType = contentTypes.find(
                            (contentType) => contentType.uid === uid
                          );

                          return contentType?.info.displayName ?? '';
                        })
                        .join('、')}
                    </Typography>
                  </Table.Cell>
                  <Table.Cell>
                    <Flex alignItems="center" justifyContent="end">
                      {canRead || canUpdate ? (
                        <IconButton
                          tag={Link}
                          to={workflow.id.toString()}
                          label={formatMessage(
                            {
                              id: 'Settings.review-workflows.list.page.list.column.actions.edit.label',
                              defaultMessage: '编辑 {name}',
                            },
                            { name: workflow.name }
                          )}
                          variant="ghost"
                        >
                          <Pencil />
                        </IconButton>
                      ) : null}
                      {workflows.length > 1 && canDelete ? (
                        <IconButton
                          withTooltip={false}
                          label={formatMessage(
                            {
                              id: 'Settings.review-workflows.list.page.list.column.actions.delete.label',
                              defaultMessage: '删除 {name}',
                            },
                            { name: workflow.name }
                          )}
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteWorkflow(String(workflow.id));
                          }}
                        >
                          <Trash />
                        </IconButton>
                      ) : null}
                    </Flex>
                  </Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table.Content>
        </Table.Root>

        <Dialog.Root open={!!workflowToDelete} onOpenChange={toggleConfirmDeleteDialog}>
          <ConfirmDialog onConfirm={handleConfirmDeleteDialog}>
            {formatMessage({
              id: 'Settings.review-workflows.list.page.delete.confirm.body',
              defaultMessage:
                '删除此工作流后，该内容类型下所有阶段相关信息将被移除。确定要删除吗？',
            })}
          </ConfirmDialog>
        </Dialog.Root>
      </Layout.Root>
    </>
  );
};

const ProtectedListPage = () => {
  const permissions = useTypedSelector(
    (state) => state.admin_app.permissions.settings?.['review-workflows']?.main
  );

  return (
    <Page.Protect permissions={permissions}>
      <ReviewWorkflowsListView />
    </Page.Protect>
  );
};

export { ProtectedListPage };
