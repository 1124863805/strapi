import { MAX_COMPONENT_DEPTH } from '../../../constants';
import { getComponentDepth } from '../../../utils/getMaxDepth';

import type { IconByType } from '../../AttributeIcon';
import type { NestedComponent } from '../../DataManagerProvider/utils/retrieveNestedComponents';
import type { Internal } from '@leao1/types';

export const getAttributesToDisplay = (
  dataTarget = '',
  targetUid: Internal.UID.Schema,
  nestedComponents: Array<NestedComponent>
): IconByType[][] => {
  const defaultAttributes: IconByType[] = [
    'text',
    'boolean',
    'blocks',
    'json',
    'number',
    'email',
    'date',
    'password',
    'media',
    'enumeration',
    'relation',
    'richtext',
  ];

  const isPickingAttributeForAContentType = dataTarget === 'contentType';

  if (isPickingAttributeForAContentType) {
    const row1 = [...defaultAttributes.slice(0, -1), 'uid', ...defaultAttributes.slice(-1)];
    return [
      [row1[0], row1[1]],
      [row1[2], row1[3]],
      [row1[4], row1[5]],
      [row1[6], row1[7]],
      [row1[8], row1[9]],
      [row1[10], row1[11]],
      [row1[12], row1[13]],
      ['component', 'dynamiczone'],
    ];
  }

  // this will only run when adding attributes to components
  if (dataTarget) {
    const componentDepth = getComponentDepth(targetUid, nestedComponents);
    const isNestedInAnotherComponent = componentDepth >= MAX_COMPONENT_DEPTH;
    const canAddComponentInAnotherComponent =
      !isPickingAttributeForAContentType && !isNestedInAnotherComponent;
    if (canAddComponentInAnotherComponent) {
      const rows: IconByType[][] = [];
      for (let i = 0; i < defaultAttributes.length; i += 2) {
        rows.push(defaultAttributes.slice(i, i + 2));
      }
      rows.push(['component']);
      return rows;
    }
  }

  const rows: IconByType[][] = [];
  for (let i = 0; i < defaultAttributes.length; i += 2) {
    rows.push(defaultAttributes.slice(i, i + 2));
  }
  return rows;
};
