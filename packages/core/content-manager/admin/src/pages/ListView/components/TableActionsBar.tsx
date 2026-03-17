import * as React from 'react';

import { Table, useTable, useQueryParams } from '@leao1/admin/leao-admin';

import { usePrev } from '../../../hooks/usePrev';

import { BulkActionsRenderer } from './BulkActions/Actions';

const TableActionsBar = () => {
  const selectRow = useTable('TableActionsBar', (state) => state.selectRow);
  const [{ query }] = useQueryParams<{ plugins: { i18n: { locale: string } } }>();
  const locale = query?.plugins?.i18n?.locale;
  const prevLocale = usePrev(locale);

  React.useEffect(() => {
    if (prevLocale !== locale) {
      selectRow([]);
    }
  }, [selectRow, prevLocale, locale]);

  return (
    <Table.ActionBar>
      <BulkActionsRenderer />
    </Table.ActionBar>
  );
};

export { TableActionsBar };
