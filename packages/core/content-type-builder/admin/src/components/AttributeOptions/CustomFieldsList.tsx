import { useLeaoApp } from '@leao/admin/leao-admin';
import { Flex, Grid, KeyboardNavigable, Link } from '@leao/design-system';
import { useIntl } from 'react-intl';

import { getTrad } from '../../utils';

import { CustomFieldOption } from './CustomFieldOption';
import { EmptyAttributes } from './EmptyAttributes';

export const CustomFieldsList = () => {
  const { formatMessage } = useIntl();
  const getAllCustomFields = useLeaoApp('CustomFieldsList', (state) => state.customFields.getAll);
  const registeredCustomFields = Object.entries(getAllCustomFields()) as [string, { name: string }][];

  if (!registeredCustomFields.length) {
    return <EmptyAttributes />;
  }

  const sortedCustomFields = registeredCustomFields.sort((a, b) =>
    a[1].name > b[1].name ? 1 : -1
  );

  return (
    <KeyboardNavigable tagName="button">
      <Flex direction="column" alignItems="stretch" gap={3}>
        <Grid.Root gap={3}>
          {sortedCustomFields.map(([uid, customField]) => (
            <Grid.Item key={uid} col={6} direction="column" alignItems="stretch">
              <CustomFieldOption key={uid} customFieldUid={uid} customField={customField} />
            </Grid.Item>
          ))}
        </Grid.Root>
        <Link
          href="#"
          isExternal
        >
          {formatMessage({
            id: getTrad('modalForm.tabs.custom.howToLink'),
            defaultMessage: 'How to add custom fields',
          })}
        </Link>
      </Flex>
    </KeyboardNavigable>
  );
};
