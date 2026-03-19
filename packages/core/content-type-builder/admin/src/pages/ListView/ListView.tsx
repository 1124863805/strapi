import * as React from 'react';
import get from 'lodash/get';
import has from 'lodash/has';
import isEqual from 'lodash/isEqual';
import upperFirst from 'lodash/upperFirst';
import { useIntl } from 'react-intl';
import { unstable_usePrompt as usePrompt, useMatch } from 'react-router-dom';

import { Button, Flex, Check, IconButton, Pencil, Plus } from '../../ui';
import { List } from '../../components/List';
import { ListRow } from '../../components/ListRow';
import { useDataManager } from '../../hooks/useDataManager';
import { useFormModalNavigation } from '../../hooks/useFormModalNavigation';
import { getAttributeDisplayedType } from '../../utils/getAttributeDisplayedType';
import { getTrad } from '../../utils/getTrad';

const ListView = () => {
  const { initialData, modifiedData, isInDevelopmentMode, isInContentTypeView, submitData } =
    useDataManager();
  const { formatMessage } = useIntl();

  const match = useMatch('/plugins/content-type-builder/:kind/:currentUID');

  const {
    onOpenModalAddComponentsToDZ,
    onOpenModalAddField,
    onOpenModalEditField,
    onOpenModalEditSchema,
    onOpenModalEditCustomField,
  } = useFormModalNavigation();

  const firstMainDataPath = isInContentTypeView ? 'contentType' : 'component';
  const mainDataTypeAttributesPath = [firstMainDataPath, 'schema', 'attributes'];
  const targetUid = get(modifiedData, [firstMainDataPath, 'uid']);
  const isTemporary = get(modifiedData, [firstMainDataPath, 'isTemporary'], false);
  const contentTypeKind = get(modifiedData, [firstMainDataPath, 'schema', 'kind'], null);

  const attributes = get(modifiedData, mainDataTypeAttributesPath, []);
  const isFromPlugin = has(initialData, [firstMainDataPath, 'plugin']);
  const hasModelBeenModified = !isEqual(modifiedData, initialData);

  const forTarget = isInContentTypeView ? 'contentType' : 'component';

  const handleClickAddComponentToDZ = (dynamicZoneTarget?: string) => {
    onOpenModalAddComponentsToDZ({ dynamicZoneTarget, targetUid });
  };

  const handleClickEditField = async (
    forTarget: string,
    targetUid: string,
    attributeName: string,
    type: string,
    customField: any
  ) => {
    const attributeType = getAttributeDisplayedType(type);
    const step = type === 'component' ? '2' : null;

    if (customField) {
      onOpenModalEditCustomField({
        forTarget,
        targetUid,
        attributeName,
        attributeType,
        customFieldUid: customField,
      });
    } else {
      onOpenModalEditField({
        forTarget,
        targetUid,
        attributeName,
        attributeType,
        step,
      });
    }
  };

  let label = get(modifiedData, [firstMainDataPath, 'schema', 'displayName'], '');
  const kind = get(modifiedData, [firstMainDataPath, 'schema', 'kind'], '');

  const isCreatingFirstContentType = match?.params.currentUID === 'create-content-type';

  if (!label && isCreatingFirstContentType) {
    label = formatMessage({
      id: getTrad('button.model.create'),
      defaultMessage: 'Create new collection type',
    });
  }

  const onEdit = () => {
    const contentType = kind || firstMainDataPath;

    onOpenModalEditSchema({
      modalType: firstMainDataPath,
      forTarget: firstMainDataPath,
      targetUid,
      kind: contentType,
    });
  };

  usePrompt({
    when: hasModelBeenModified,
    message: formatMessage({ id: getTrad('prompt.unsaved'), defaultMessage: 'Are you sure?' }),
  });

  return (
    <div className="ctb-layout">
      <div className="ctb-card">
        <div className="ctb-card-header">
          <div className="ctb-card-header-left">
              <h1 className="ctb-schema-title">
                {upperFirst(label)}
                {!isFromPlugin && !isCreatingFirstContentType && isInDevelopmentMode && (
                  <IconButton
                    label={formatMessage({ id: 'app.utils.edit', defaultMessage: '编辑' })}
                    onClick={onEdit}
                    style={{ marginLeft: 'var(--ctb-space-2)', verticalAlign: 'middle' }}
                  >
                    <Pencil />
                  </IconButton>
                )}
              </h1>
              <span className="ctb-tab-label">
                {formatMessage({ id: getTrad('listView.fields'), defaultMessage: '全部字段' })}
              </span>
          </div>
          <div className="ctb-card-header-right">
              {isInDevelopmentMode && (
                <Flex gap={2}>
                  {!isCreatingFirstContentType && (
                    <Button
                      startIcon={<Plus />}
                      variant="secondary"
                      size="S"
                      onClick={() => onOpenModalAddField({ forTarget, targetUid })}
                    >
                      {formatMessage({
                        id: getTrad('button.attributes.add.another'),
                        defaultMessage: '添加字段',
                      })}
                    </Button>
                  )}
                  <Button
                    startIcon={<Check />}
                    size="S"
                    onClick={async () => await submitData()}
                    type="submit"
                    disabled={isEqual(modifiedData, initialData)}
                  >
                    {formatMessage({ id: 'global.save', defaultMessage: '保存' })}
                  </Button>
                </Flex>
              )}
          </div>
        </div>
        <div className="ctb-list-scroll">
            <List
              items={attributes}
              customRowComponent={(props) => <ListRow {...props} onClick={handleClickEditField} />}
              addComponentToDZ={handleClickAddComponentToDZ}
              targetUid={targetUid}
              editTarget={forTarget}
              isMain
            />
        </div>
      </div>
    </div>
  );
};

export default ListView;
