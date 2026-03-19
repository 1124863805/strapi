import { Grid, KeyboardNavigable } from '../../ui';

import { IconByType } from '../AttributeIcon';

import { AttributeOption } from './AttributeOption';

type AttributeListProps = {
  attributes: IconByType[][];
};

export const AttributeList = ({ attributes }: AttributeListProps) => {
  const flatAttributes = attributes.flat();
  return (
    <KeyboardNavigable tagName="button">
      <Grid.Root gap={2}>
        {flatAttributes.map((attribute) => (
          <Grid.Item key={attribute} col={4} direction="column" alignItems="stretch">
            <AttributeOption type={attribute} />
          </Grid.Item>
        ))}
      </Grid.Root>
    </KeyboardNavigable>
  );
};
