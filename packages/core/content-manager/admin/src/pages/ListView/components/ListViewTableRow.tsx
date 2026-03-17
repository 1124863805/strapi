import { Typography } from '@leao1/design-system';
import { Table } from '@leao1/admin/leao-admin';

import { getDisplayName } from '../../../utils/users';
import { DocumentStatus } from '../../EditView/components/DocumentStatus';

import { ActionsCell } from './ActionsCell';
import { CellContent } from './TableCells/CellContent';
import { TableActions } from './TableActions';

import type { Document } from '../../../hooks/useDocument';
import type { ListFieldLayout } from '../../../hooks/useDocumentLayout';

interface ListViewTableRowProps {
  row: Document;
  tableHeaders: ListFieldLayout[];
  collectionType: string;
  model: string;
  onRowClick: (id: Document['documentId']) => () => void;
}

const ListViewTableRow = ({
  row,
  tableHeaders,
  collectionType,
  model,
  onRowClick,
}: ListViewTableRowProps) => (
  <Table.Row cursor="pointer" key={row.id} onClick={onRowClick(row.documentId)}>
    <Table.CheckboxCell id={row.id} />
    {tableHeaders.map(({ cellFormatter, ...header }, cellIndex) => {
      if (header.name === 'status') {
        const { status } = row;

        return (
          <Table.Cell key={`${header.name}-${cellIndex}`}>
            <DocumentStatus status={status} maxWidth={'min-content'} />
          </Table.Cell>
        );
      }
      if (['createdBy', 'updatedBy'].includes(header.name.split('.')[0])) {
        return (
          <Table.Cell key={`${header.name}-${cellIndex}`}>
            <Typography textColor="neutral800">
              {row[header.name.split('.')[0]]
                ? getDisplayName(row[header.name.split('.')[0]])
                : '-'}
            </Typography>
          </Table.Cell>
        );
      }
      if (typeof cellFormatter === 'function') {
        return (
          <Table.Cell key={`${header.name}-${cellIndex}`}>
            {/* @ts-expect-error – TODO: fix this TS error */}
            {cellFormatter(row, header, { collectionType, model })}
          </Table.Cell>
        );
      }
      return (
        <Table.Cell key={`${header.name}-${cellIndex}`}>
          <CellContent
            content={row[header.name.split('.')[0]]}
            rowId={row.documentId}
            {...header}
          />
        </Table.Cell>
      );
    })}
    <ActionsCell onClick={(e) => e.stopPropagation()}>
      <TableActions document={row} />
    </ActionsCell>
  </Table.Row>
);

export { ListViewTableRow };
