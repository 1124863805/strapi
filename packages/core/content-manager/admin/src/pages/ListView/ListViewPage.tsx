import * as React from 'react';

import { Flex } from '@leao1/design-system';
import {
  Page,
  SearchInput,
  BackButton,
  useNotification,
  useLeaoApp,
  useAPIErrorHandler,
  useQueryParams,
  useRBAC,
  Layouts,
  Pagination,
  Table,
} from '@leao1/admin/leao-admin';
import isEqual from 'lodash/isEqual';
import { stringify } from 'qs';
import { useIntl } from 'react-intl';
import { useNavigate, useParams } from 'react-router-dom';

import { InjectionZone } from '../../components/InjectionZone';
import { HOOKS } from '../../constants/hooks';
import { PERMISSIONS } from '../../constants/plugin';
import { DocumentRBAC, useDocumentRBAC } from '../../features/DocumentRBAC';
import { useDoc } from '../../hooks/useDocument';
import {
  ListFieldLayout,
  convertListLayoutToFieldLayouts,
  useDocumentLayout,
} from '../../hooks/useDocumentLayout';
import { usePrev } from '../../hooks/usePrev';
import { useGetAllDocumentsQuery } from '../../services/documents';
import { buildValidParams } from '../../utils/api';
import { getTranslation } from '../../utils/translations';

import { CreateButton } from './components/CreateButton';
import { Filters } from './components/Filters';
import { ListViewHeader } from './components/ListViewHeader';
import { ListViewTableRow } from './components/ListViewTableRow';
import { TableActionsBar } from './components/TableActionsBar';
import { ViewSettingsMenu } from './components/ViewSettingsMenu';

import type { Modules } from '@leao1/types';

const { INJECT_COLUMN_IN_TABLE } = HOOKS;

/* -------------------------------------------------------------------------------------------------
 * ListViewPage
 * -----------------------------------------------------------------------------------------------*/

const ListViewPage = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { toggleNotification } = useNotification();
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler(getTranslation);

  const { collectionType, model, schema } = useDoc();
  const { list } = useDocumentLayout(model);

  const [displayedHeaders, setDisplayedHeaders] = React.useState<ListFieldLayout[]>([]);

  const listLayout = usePrev(list.layout);
  React.useEffect(() => {
    if (!isEqual(listLayout, list.layout)) {
      setDisplayedHeaders(list.layout);
    }
  }, [list.layout, listLayout]);

  const handleSetHeaders = (headers: string[]) => {
    setDisplayedHeaders(
      convertListLayoutToFieldLayouts(headers, schema!.attributes, list.metadatas)
    );
  };

  const [{ query }] = useQueryParams<{
    plugins?: Record<string, unknown>;
    page?: string;
    pageSize?: string;
    sort?: string;
  }>({
    page: '1',
    pageSize: list.settings.pageSize.toString(),
    sort: list.settings.defaultSortBy
      ? `${list.settings.defaultSortBy}:${list.settings.defaultSortOrder}`
      : '',
  });

  const params = React.useMemo(() => buildValidParams(query), [query]);
  const queryString = React.useMemo(
    () => stringify(params, { encode: true, encodeValuesOnly: true }),
    [params]
  );
  const paramObject = React.useMemo(() => {
    const pairs = queryString.split('&').map((param) => {
      const [key, value] = param.split('=');
      return { [key]: value };
    });
    return Object.assign({}, ...pairs);
  }, [queryString]);

  const { data, error, isFetching } = useGetAllDocumentsQuery({
    model,
    params: paramObject,
  });

  React.useEffect(() => {
    if (error) {
      toggleNotification({
        type: 'danger',
        message: formatAPIError(error),
      });
    }
  }, [error, formatAPIError, toggleNotification]);

  const { results = [], pagination } = data ?? {};

  React.useEffect(() => {
    if (pagination && pagination.pageCount > 0 && pagination.page > pagination.pageCount) {
      navigate(
        {
          search: stringify({
            ...query,
            page: pagination.pageCount,
          }),
        },
        { replace: true }
      );
    }
  }, [pagination, query, navigate]);

  const { canCreate } = useDocumentRBAC('ListViewPage', ({ canCreate }) => ({
    canCreate,
  }));

  const runHookWaterfall = useLeaoApp('ListViewPage', ({ runHookWaterfall }) => runHookWaterfall);
  const tableHeaders = React.useMemo(() => {
    const headers = runHookWaterfall(INJECT_COLUMN_IN_TABLE, {
      displayedHeaders,
      layout: list,
    });

    const formattedHeaders = headers.displayedHeaders.map<ListFieldLayout>((header) => ({
      ...header,
      label: typeof header.label === 'string' ? header.label : formatMessage(header.label),
      name: `${header.name}${header.mainField?.name ? `.${header.mainField.name}` : ''}`,
    }));

    if (schema?.options?.draftAndPublish) {
      formattedHeaders.push({
        attribute: { type: 'custom' },
        name: 'status',
        label: formatMessage({
          id: getTranslation(`containers.list.table-headers.status`),
          defaultMessage: 'status',
        }),
        searchable: false,
        sortable: false,
      } satisfies ListFieldLayout);
    }

    return formattedHeaders;
  }, [displayedHeaders, formatMessage, list, runHookWaterfall, schema?.options?.draftAndPublish]);

  if (isFetching) {
    return <Page.Loading />;
  }

  if (error) {
    return <Page.Error />;
  }

  const contentTypeTitle = schema?.info.displayName ?? 'Untitled';

  const handleRowClick = (id: Modules.Documents.ID) => () => {
    navigate({
      pathname: id.toString(),
      search: stringify({ plugins: query.plugins }),
    });
  };

  return (
    <Page.Main>
      <Page.Title>{contentTypeTitle}</Page.Title>
      <ListViewHeader
        primaryAction={canCreate ? <CreateButton /> : null}
        subtitle={formatMessage(
          {
            id: getTranslation('pages.ListView.header-subtitle'),
            defaultMessage:
              '{number, plural, =0 {# entries} one {# entry} other {# entries}} found',
          },
          { number: pagination?.total }
        )}
        title={contentTypeTitle}
        navigationAction={<BackButton />}
      />
      <Layouts.Action
        endActions={
          <>
            <InjectionZone area="listView.actions" />
            <ViewSettingsMenu
              setHeaders={handleSetHeaders}
              resetHeaders={() => setDisplayedHeaders(list.layout)}
              headers={displayedHeaders.map((header) => header.name)}
            />
          </>
        }
        startActions={
          <>
            {list.settings.searchable && (
              <SearchInput
                disabled={results.length === 0}
                label={formatMessage(
                  { id: 'app.component.search.label', defaultMessage: 'Search for {target}' },
                  { target: contentTypeTitle }
                )}
                placeholder={formatMessage({
                  id: 'global.search',
                  defaultMessage: 'Search',
                })}
                trackedEvent="didSearch"
              />
            )}
            {list.settings.filterable && schema ? (
              <Filters disabled={results.length === 0} schema={schema} />
            ) : null}
          </>
        }
      />
      <Layouts.Content>
        <Flex gap={4} direction="column" alignItems="stretch">
          <Table.Root rows={results} headers={tableHeaders} isLoading={isFetching}>
            <TableActionsBar />
            <Table.Content>
              <Table.Head>
                <Table.HeaderCheckboxCell />
                {tableHeaders.map((header: ListFieldLayout, index) => (
                  <Table.HeaderCell key={`${header.name}-${index}`} {...header} />
                ))}
              </Table.Head>
              <Table.Loading />
              <Table.Empty action={canCreate ? <CreateButton variant="secondary" /> : null} />
              <Table.Body>
                {results.map((row) => (
                  <ListViewTableRow
                    key={row.id}
                    row={row}
                    tableHeaders={tableHeaders}
                    collectionType={collectionType}
                    model={model}
                    onRowClick={handleRowClick}
                  />
                ))}
              </Table.Body>
            </Table.Content>
          </Table.Root>
          <Pagination.Root {...pagination}>
            <Pagination.PageSize />
            <Pagination.Links />
          </Pagination.Root>
        </Flex>
      </Layouts.Content>
    </Page.Main>
  );
};

/* -------------------------------------------------------------------------------------------------
 * ProtectedListViewPage
 * -----------------------------------------------------------------------------------------------*/

const ProtectedListViewPage = () => {
  const { slug = '' } = useParams<{ slug: string }>();
  const { permissions = [], isLoading, error } = useRBAC(
    PERMISSIONS.map((action) => ({ action, subject: slug }))
  );

  if (isLoading) {
    return <Page.Loading />;
  }

  if (error || !slug) {
    return <Page.Error />;
  }

  return (
    <Page.Protect permissions={permissions}>
      {({ permissions }) => (
        <DocumentRBAC permissions={permissions}>
          <ListViewPage />
        </DocumentRBAC>
      )}
    </Page.Protect>
  );
};

export { ListViewPage, ProtectedListViewPage };
