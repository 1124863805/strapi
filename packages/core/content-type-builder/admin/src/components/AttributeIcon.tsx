/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, SVGProps } from 'react';

import { useLeaoApp } from '@leao1/admin/leao-admin';
import { Box } from '@leao1/design-system';
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
} from '@leao1/icons/symbols';
import { styled } from 'styled-components';

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

const IconBox = styled(Box)`
  svg {
    height: 100%;
    width: 100%;
  }
`;

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
    <IconBox width="3.2rem" shrink={0} {...rest} aria-hidden>
      <Box tag={Compo} />
    </IconBox>
  );
};
