 import type { ComponentType } from 'react';
import { Fragment } from 'react';
import { useIntl } from 'react-intl';

import { useDataManager } from '../hooks/useDataManager';
import { useFormModalNavigation } from '../hooks/useFormModalNavigation';
import { Box, Button, EmptyState, EmptyDocuments, Plus, Typography } from '../ui';
import { getTrad } from '../utils/getTrad';

import { BoxWrapper } from './BoxWrapper';
import { ComponentList } from './ComponentList';
import { DynamicZoneList } from './DynamicZoneList';
import { NestedTFooter } from './NestedFooter';

import type { SchemaType } from '../types';
import type { Internal } from '@leao1/types';

interface ListProps {
  addComponentToDZ?: () => void;
  customRowComponent: ComponentType<any>;
  editTarget: SchemaType;
  firstLoopComponentUid?: string;
  isFromDynamicZone?: boolean;
  isNestedInDZComponent?: boolean;
  isMain?: boolean;
  items: any[];
  secondLoopComponentUid?: string | null;
  targetUid?: Internal.UID.Schema;
  isSub?: boolean;
}

export const List = ({
  addComponentToDZ,
  customRowComponent,
  editTarget,
  firstLoopComponentUid,
  isFromDynamicZone = false,
  isMain = false,
  isNestedInDZComponent = false,
  isSub = false,
  items = [],
  secondLoopComponentUid,
  targetUid,
}: ListProps) => {
  const { formatMessage } = useIntl();
  const { isInDevelopmentMode, modifiedData, isInContentTypeView } = useDataManager();

  const { onOpenModalAddField } = useFormModalNavigation();
  const onClickAddField = () => {
    onOpenModalAddField({ forTarget: editTarget, targetUid });
  };

  const tableHeader = (
    <thead>
      <tr>
        <th>
          <Typography variant="sigma" textColor="neutral600">
            {formatMessage({ id: 'global.name', defaultMessage: 'Name' })}
          </Typography>
        </th>
        <th colSpan={2}>
          <Typography variant="sigma" textColor="neutral600">
            {formatMessage({ id: 'global.type', defaultMessage: 'Type' })}
          </Typography>
        </th>
      </tr>
    </thead>
  );

  if (!targetUid) {
    return (
      <BoxWrapper className="ctb-table-wrapper">
        <table>
          {tableHeader}
          <tbody>
            <tr className="ctb-row-empty">
              <td colSpan={2}>
                <EmptyState
                  icon={<EmptyDocuments width="48px" />}
                  content={formatMessage({
                    id: getTrad('table.content.create-first-content-type'),
                    defaultMessage: 'Create your first Collection-Type',
                  })}
                />
              </td>
            </tr>
          </tbody>
        </table>
      </BoxWrapper>
    );
  }

  if (items.length === 0 && isMain) {
    return (
      <BoxWrapper className="ctb-table-wrapper">
        <table>
          {tableHeader}
          <tbody>
            <tr className="ctb-row-empty">
              <td colSpan={2}>
                <EmptyState
                  icon={<Plus style={{ width: 28, height: 28 }} />}
                  content={formatMessage(
                    isInContentTypeView
                      ? {
                          id: getTrad('table.content.no-fields.collection-type'),
                          defaultMessage: 'Add your first field to this Collection-Type',
                        }
                      : {
                          id: getTrad('table.content.no-fields.component'),
                          defaultMessage: 'Add your first field to this component',
                        }
                  )}
                  action={
                    <Button
                      onClick={onClickAddField}
                      size="L"
                      startIcon={<Plus />}
                      variant="secondary"
                    >
                      {formatMessage({
                        id: getTrad('table.button.no-fields'),
                        defaultMessage: 'Add new field',
                      })}
                    </Button>
                  }
                />
              </td>
            </tr>
          </tbody>
        </table>
      </BoxWrapper>
    );
  }

  return (
    <BoxWrapper className="ctb-table-wrapper">
      <Box
        style={{
          paddingLeft: isMain ? 0 : 20,
          paddingRight: isMain ? 0 : 0,
          overflowX: isMain ? 'auto' : undefined,
        }}
      >
        <table>
          {isMain && tableHeader}
          <tbody>
            {items.map((item) => {
              const { type } = item;
              const CustomRow = customRowComponent;

              return (
                <Fragment key={item.name}>
                  <CustomRow
                    {...item}
                    isNestedInDZComponent={isNestedInDZComponent}
                    targetUid={targetUid}
                    editTarget={editTarget}
                    firstLoopComponentUid={firstLoopComponentUid}
                    isFromDynamicZone={isFromDynamicZone}
                    secondLoopComponentUid={secondLoopComponentUid}
                  />

                  {type === 'component' && (
                    <ComponentList
                      {...item}
                      customRowComponent={customRowComponent}
                      targetUid={targetUid}
                      isNestedInDZComponent={isFromDynamicZone}
                      editTarget={editTarget}
                      firstLoopComponentUid={firstLoopComponentUid}
                    />
                  )}

                  {type === 'dynamiczone' && (
                    <DynamicZoneList
                      {...item}
                      customRowComponent={customRowComponent}
                      addComponent={addComponentToDZ}
                      targetUid={targetUid}
                    />
                  )}
                </Fragment>
              );
            })}
          </tbody>
        </table>
      </Box>

      {isSub && isInDevelopmentMode && !isFromDynamicZone && (
        <NestedTFooter
          icon={<Plus />}
          onClick={onClickAddField}
          color={isFromDynamicZone ? 'primary' : 'neutral'}
        >
          {formatMessage({
            id: getTrad(`form.button.add.field.to.component`),
            defaultMessage: 'Add another field',
          })}
        </NestedTFooter>
      )}
    </BoxWrapper>
  );
};
