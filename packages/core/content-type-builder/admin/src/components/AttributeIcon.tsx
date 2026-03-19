/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ComponentType } from 'react';

import { useLeaoApp } from '@leao1/admin/leao-admin';
import {
  BooleanField,
  CollectionType,
  ComponentField,
  DateField,
  DynamicZoneField,
  EmailField,
  EnumerationField,
  JsonField,
  MediaField,
  NumberField,
  PasswordField,
  RelationField,
  MarkdownField,
  SingleType,
  TextField,
  UidField,
  BlocksField,
} from '../ui/symbols';
import { styled } from 'styled-components';

import { Box } from '../ui';

const IconBox = styled(Box)`
  width: 3.6rem;
  height: 3.6rem;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--ctb-radius-sm);
  background: var(--ctb-bg);
  svg {
    height: 2.6rem;
    width: 2.6rem;
  }
`;

const iconByTypes: Record<string, ComponentType<any>> = {
  biginteger: NumberField,
  blocks: BlocksField,
  boolean: BooleanField,
  collectionType: CollectionType,
  component: ComponentField,
  contentType: CollectionType,
  date: DateField,
  datetime: DateField,
  decimal: NumberField,
  dynamiczone: DynamicZoneField,
  email: EmailField,
  enum: EnumerationField,
  enumeration: EnumerationField,
  file: MediaField,
  files: MediaField,
  float: NumberField,
  integer: NumberField,
  json: JsonField,
  JSON: JsonField,
  media: MediaField,
  number: NumberField,
  password: PasswordField,
  relation: RelationField,
  richtext: MarkdownField,
  singleType: SingleType,
  string: TextField,
  text: TextField,
  time: DateField,
  timestamp: DateField,
  uid: UidField,
};

export type IconByType = keyof typeof iconByTypes;

type AttributeIconProps = {
  type: IconByType;
  customField?: string | null;
};

export const AttributeIcon = ({ type, customField = null, ...rest }: AttributeIconProps) => {
  const getCustomField = useLeaoApp('AttributeIcon', (state) => state.customFields.get);

  let Compo: any = iconByTypes[type];

  if (customField) {
    const customFieldObject = getCustomField(customField);
    const icon = customFieldObject?.icon;
    if (icon) {
      Compo = icon;
    }
  }

  if (!iconByTypes[type]) {
    return null;
  }

  return (
    <IconBox {...rest} aria-hidden>
      <Compo />
    </IconBox>
  );
};
