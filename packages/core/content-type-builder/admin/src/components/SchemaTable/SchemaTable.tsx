import { useMemo } from 'react';
import { Table, Dropdown, Space, Button } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import get from 'lodash/get';
import upperFirst from 'lodash/upperFirst';
import { useIntl } from 'react-intl';

import { useDataManager } from '../../hooks/useDataManager';
import { useFormModalNavigation } from '../../hooks/useFormModalNavigation';
import { getAttributeDisplayedType } from '../../utils/getAttributeDisplayedType';
import { getTrad } from '../../utils/getTrad';
import { AttributeIcon } from '../AttributeIcon';
import { DisplayedType } from '../DisplayedType';

import type { IconByType } from '../AttributeIcon';
import type { Internal } from '@leao1/types';

interface FlatRow {
  key: string;
  schemaUid: string;
  schemaName: string;
  schemaKind: string;
  forTarget: 'contentType' | 'component';
  fieldName: string;
  fieldType: string;
  customField?: string | null;
  repeatable?: boolean;
  target?: string | null;
  configurable?: boolean;
}

const buildFlatData = (
  contentTypes: Record<string, any>,
  components: Record<string, any>
): FlatRow[] => {
  const rows: FlatRow[] = [];

  Object.entries(contentTypes).forEach(([uid, ct]) => {
    const schema = ct?.schema;
    if (!schema) return;
    const attrs = schema.attributes || [];
    const displayName = schema.displayName || uid;
    const kind = schema.kind || 'collectionType';

    attrs.forEach((attr: any) => {
      rows.push({
        key: `ct-${uid}-${attr.name}`,
        schemaUid: uid,
        schemaName: displayName,
        schemaKind: kind,
        forTarget: 'contentType',
        fieldName: attr.name,
        fieldType: attr.type || 'relation',
        customField: attr.customField,
        repeatable: attr.repeatable,
        target: attr.target || null,
        configurable: attr.configurable !== false,
      });
    });
  });

  Object.entries(components).forEach(([uid, comp]) => {
    const schema = comp?.schema;
    if (!schema) return;
    const attrs = schema.attributes || [];
    const displayName = schema.displayName || uid;

    attrs.forEach((attr: any) => {
      rows.push({
        key: `comp-${uid}-${attr.name}`,
        schemaUid: uid,
        schemaName: displayName,
        schemaKind: 'component',
        forTarget: 'component',
        fieldName: attr.name,
        fieldType: attr.type || 'relation',
        customField: attr.customField,
        repeatable: attr.repeatable,
        target: attr.target || null,
        configurable: attr.configurable !== false,
      });
    });
  });

  return rows;
};

export const SchemaTable = () => {
  const { formatMessage } = useIntl();
  const { isInDevelopmentMode, removeAttribute, contentTypes, components } = useDataManager();
  const {
    onOpenModalEditField,
    onOpenModalEditSchema,
    onOpenModalEditCustomField,
    onOpenModalCreateSchema,
  } = useFormModalNavigation();

  const dataSource = useMemo(() => buildFlatData(contentTypes, components), [
    contentTypes,
    components,
  ]);

  const handleEditField = (row: FlatRow) => {
    const attrType = getAttributeDisplayedType(row.fieldType) as IconByType;
    const step = row.fieldType === 'component' ? '2' : null;

    if (row.customField) {
      onOpenModalEditCustomField({
        forTarget: row.forTarget,
        targetUid: row.schemaUid as Internal.UID.Schema,
        attributeName: row.fieldName,
        attributeType: attrType,
        customFieldUid: row.customField,
      });
    } else {
      onOpenModalEditField({
        forTarget: row.forTarget,
        targetUid: row.schemaUid,
        attributeName: row.fieldName,
        attributeType: attrType,
        step,
      });
    }
  };

  const handleRemoveField = (row: FlatRow, e: React.MouseEvent) => {
    e.stopPropagation();
    removeAttribute(
      row.forTarget === 'contentType' ? 'contentTypes' : 'components',
      row.fieldName,
      row.schemaUid
    );
  };

  const handleEditSchema = (row: FlatRow) => {
    onOpenModalEditSchema({
      modalType: row.forTarget,
      forTarget: row.forTarget,
      targetUid: row.schemaUid,
      kind: row.schemaKind === 'component' ? undefined : row.schemaKind,
    });
  };

  const canCreate =
    !Object.keys(contentTypes).some((k) => contentTypes[k]?.isTemporary) &&
    !Object.keys(components).some((k) => (components as any)[k]?.isTemporary);

  const handleCreateCollection = () => {
    if (canCreate) {
      onOpenModalCreateSchema({
        modalType: 'contentType',
        kind: 'collectionType',
        actionType: 'create',
        forTarget: 'contentType',
      });
    }
  };
  const handleCreateSingle = () => {
    if (canCreate) {
      onOpenModalCreateSchema({
        modalType: 'contentType',
        kind: 'singleType',
        actionType: 'create',
        forTarget: 'contentType',
      });
    }
  };
  const handleCreateComponent = () => {
    if (canCreate) {
      onOpenModalCreateSchema({
        modalType: 'component',
        kind: null,
        actionType: 'create',
        forTarget: 'component',
      });
    }
  };

  const addMenuItems = [
    {
      key: 'collection',
      label: formatMessage({
        id: getTrad('button.model.create'),
        defaultMessage: '新建集合类型',
      }),
      onClick: handleCreateCollection,
    },
    {
      key: 'single',
      label: formatMessage({
        id: getTrad('button.single-types.create'),
        defaultMessage: '新建单类型',
      }),
      onClick: handleCreateSingle,
    },
    {
      key: 'component',
      label: formatMessage({
        id: getTrad('button.component.create'),
        defaultMessage: '新建组件',
      }),
      onClick: handleCreateComponent,
    },
  ];

  const columns: TableProps<FlatRow>['columns'] = [
    {
      title: formatMessage({ id: getTrad('table.column.schema'), defaultMessage: '集合名称' }),
      dataIndex: 'schemaName',
      key: 'schemaName',
      width: 200,
      sorter: (a, b) => a.schemaName.localeCompare(b.schemaName),
      render: (name, row) => (
        <Space>
          <span style={{ fontWeight: 600 }}>{upperFirst(name)}</span>
          <span
            style={{
              fontSize: 12,
              color: 'var(--ctb-text-disabled)',
              textTransform: 'capitalize',
            }}
          >
            {row.schemaKind === 'collectionType'
              ? formatMessage({ id: getTrad('kind.collectionType'), defaultMessage: '集合' })
              : row.schemaKind === 'singleType'
                ? formatMessage({ id: getTrad('kind.singleType'), defaultMessage: '单类型' })
                : formatMessage({ id: getTrad('menu.section.components.name'), defaultMessage: '组件' })}
          </span>
        </Space>
      ),
    },
    {
      title: formatMessage({ id: 'global.name', defaultMessage: '字段名' }),
      dataIndex: 'fieldName',
      key: 'fieldName',
      width: 180,
      render: (name, row) => (
        <Space>
          <AttributeIcon type={row.fieldType as IconByType} customField={row.customField} />
          <span style={{ fontWeight: 500 }}>{name}</span>
        </Space>
      ),
    },
    {
      title: formatMessage({ id: 'global.type', defaultMessage: '类型' }),
      dataIndex: 'fieldType',
      key: 'fieldType',
      width: 160,
      render: (_, row) => (
        <DisplayedType
          type={row.fieldType}
          customField={row.customField}
          repeatable={row.repeatable}
        />
      ),
    },
    ...(isInDevelopmentMode
      ? [
          {
            title: formatMessage({ id: 'app.utils.actions', defaultMessage: '操作' }),
            key: 'actions',
            width: 120,
            fixed: 'right' as const,
            render: (_: unknown, row: FlatRow) => (
              <Space>
                {row.configurable && (
                  <Button
                    type="text"
                    size="small"
                    icon={<EditOutlined />}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditField(row);
                    }}
                  >
                    {formatMessage({ id: 'app.utils.edit', defaultMessage: '编辑' })}
                  </Button>
                )}
                <Button
                  type="text"
                  size="small"
                  danger
                  icon={<DeleteOutlined />}
                  onClick={(e) => handleRemoveField(row, e)}
                >
                  {formatMessage({ id: 'global.delete', defaultMessage: '删除' })}
                </Button>
              </Space>
            ),
          },
        ]
      : []),
  ];

  return (
    <div style={{ padding: 'var(--ctb-space-6)' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 'var(--ctb-space-4)',
        }}
      >
        <h2 style={{ margin: 0, fontSize: 20, fontWeight: 600, color: 'var(--ctb-text)' }}>
          {formatMessage({
            id: getTrad('plugin.name'),
            defaultMessage: 'Content-Type Builder',
          })}
        </h2>
        {isInDevelopmentMode && (
          <Dropdown menu={{ items: addMenuItems }} trigger={['click']}>
            <Button type="primary" icon={<PlusOutlined />}>
              {formatMessage({
                id: getTrad('button.add'),
                defaultMessage: '增加新的',
              })}
            </Button>
          </Dropdown>
        )}
      </div>
      <Table<FlatRow>
        dataSource={dataSource}
        columns={columns}
        pagination={{ pageSize: 20, showSizeChanger: true, showTotal: (t) => `共 ${t} 条` }}
        locale={{
          emptyText: formatMessage({
            id: getTrad('table.content.create-first-content-type'),
            defaultMessage: '创建您的第一个集合类型',
          }),
        }}
        components={{
          header: {
            cell: (props: any) => (
              <th
                {...props}
                style={{
                  ...props.style,
                  background: 'var(--ctb-bg)',
                  fontWeight: 600,
                  color: 'var(--ctb-text-muted)',
                }}
              />
            ),
          },
          body: {
            row: (props: any) => (
              <tr
                {...props}
                style={{
                  ...props.style,
                  cursor: isInDevelopmentMode ? 'pointer' : 'default',
                }}
                onClick={() => {
                  if (isInDevelopmentMode && props['data-row-key']) {
                    const row = dataSource.find((r) => r.key === props['data-row-key']);
                    if (row) handleEditField(row);
                  }
                }}
              />
            ),
          },
        }}
        style={{ background: 'var(--ctb-bg-elevated)', borderRadius: 'var(--ctb-radius-sm)', overflow: 'hidden' }}
      />
    </div>
  );
};
