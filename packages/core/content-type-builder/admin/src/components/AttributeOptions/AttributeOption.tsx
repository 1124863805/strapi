/**
 *
 * AttributeOption
 *
 */

import { Box, Flex, Typography, Sparkle } from '../../ui';
import { useIntl } from 'react-intl';

import { useFormModalNavigation } from '../../hooks/useFormModalNavigation';
import { getTrad } from '../../utils/getTrad';
import { AttributeIcon, IconByType } from '../AttributeIcon';

import { OptionBoxWrapper } from './OptionBoxWrapper';

const newAttributes: string[] = [];

const NewBadge = () => (
  <Flex grow={1} justifyContent="flex-end">
    <Flex gap={1} hasRadius background="alternative100" padding={`var(--ctb-space-1) var(--ctb-space-2)`}>
      <Sparkle width="1rem" height="1rem" fill="var(--ctb-primary)" />
      <Typography variant="sigma" style={{ color: 'var(--ctb-primary)' }}>
        New
      </Typography>
    </Flex>
  </Flex>
);

type AttributeOptionProps = {
  type: IconByType;
};

export const AttributeOption = ({ type = 'text' }: AttributeOptionProps) => {
  const { formatMessage } = useIntl();

  const { onClickSelectField } = useFormModalNavigation();

  const handleClick = () => {
    const step = type === 'component' ? '1' : null;

    onClickSelectField({
      attributeType: type,
      step,
    });
  };

  return (
    <OptionBoxWrapper tag="button" type="button" onClick={handleClick}>
      <Flex gap={3} alignItems="flex-start">
        <AttributeIcon type={type} />
        <Box width="100%" style={{ minWidth: 0 }}>
          <Flex justifyContent="space-between">
            <Typography fontWeight="bold" textColor="neutral800">
              {formatMessage({ id: getTrad(`attribute.${type}`), defaultMessage: type })}
            </Typography>
            {newAttributes.includes(type) && <NewBadge />}
          </Flex>
          <Flex>
            <Typography variant="pi" textColor="neutral600">
              {formatMessage({
                id: getTrad(`attribute.${type}.description`),
                defaultMessage: 'A type for modeling data',
              })}
            </Typography>
          </Flex>
        </Box>
      </Flex>
    </OptionBoxWrapper>
  );
};
