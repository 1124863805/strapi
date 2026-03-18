import React from 'react';

import { Box, Card, CardAction, CardBadge, CardBody, CardCheckbox, CardContent } from '@leao1/design-system';
import { CardHeader } from '@leao1/design-system';
import { CardSubtitle } from '@leao1/design-system';
import { CardTitle } from '@leao1/design-system';
import { Flex } from '@leao1/design-system';
import { IconButton } from '@leao1/design-system';
import { Pencil, Trash } from '@leao1/design-system/icons';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

import { getTrad } from '../../utils';

const Extension = styled.span`
  text-transform: uppercase;
`;

const CardActionsContainer = styled(CardAction)`
  opacity: 0;

  &:focus-within {
    opacity: 1;
  }
`;

const CardContainer = styled(Card)`
  cursor: pointer;

  &:hover {
    ${CardActionsContainer} {
      opacity: 1;
    }
  }
`;

export const AssetCardBase = ({
  children = undefined,
  extension,
  isSelectable = true,
  name,
  onSelect = undefined,
  onRemove = undefined,
  onEdit = undefined,
  selected = false,
  subtitle = '',
  variant = 'Image',
}) => {
  const { formatMessage } = useIntl();

  /** @type {import("react").MouseEventHandler<HTMLDivElement> } */
  const handleClick = (e) => {
    if (onEdit) {
      onEdit(e);
    }
  };

  /**
   * @type {import("react").MouseEventHandler<HTMLDivElement> }
   *
   * This is required because we need to stop the propagation of the event
   * bubbling to the `CardContainer`, however the `CardCheckbox` only returns
   * the `boolean` value as opposed to the event itself.
   */
  const handlePropagationClick = (e) => {
    e.stopPropagation();
  };

  return (
    <CardContainer role="button" height="100%" tabIndex={-1} onClick={handleClick}>
      <CardHeader>
        {isSelectable && (
          // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
          <div onClick={handlePropagationClick}>
            <CardCheckbox checked={selected} onCheckedChange={onSelect} />
          </div>
        )}
        {(onRemove || onEdit) && (
          <CardActionsContainer onClick={handlePropagationClick} position="end">
            {onRemove && (
              <IconButton
                label={formatMessage({
                  id: getTrad('control-card.remove-selection'),
                  defaultMessage: 'Remove from selection',
                })}
                onClick={onRemove}
              >
                <Trash />
              </IconButton>
            )}

            {onEdit && (
              <IconButton
                label={formatMessage({ id: getTrad('control-card.edit'), defaultMessage: 'Edit' })}
                onClick={onEdit}
              >
                <Pencil />
              </IconButton>
            )}
          </CardActionsContainer>
        )}
        {children}
      </CardHeader>
      <CardBody>
        <CardContent>
          <Box paddingTop={1}>
            <CardTitle tag="h2">{name}</CardTitle>
          </Box>
          <CardSubtitle>
            <Extension>{extension}</Extension>
            {subtitle}
          </CardSubtitle>
        </CardContent>
        <Flex paddingTop={1} grow={1}>
          <CardBadge>
            {formatMessage({
              id: getTrad(`settings.section.${variant.toLowerCase()}.label`),
              defaultMessage: variant,
            })}
          </CardBadge>
        </Flex>
      </CardBody>
    </CardContainer>
  );
};

AssetCardBase.propTypes = {
  children: PropTypes.node,
  extension: PropTypes.string.isRequired,
  isSelectable: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onEdit: PropTypes.func,
  onSelect: PropTypes.func,
  onRemove: PropTypes.func,
  selected: PropTypes.bool,
  subtitle: PropTypes.string,
  variant: PropTypes.oneOf(['Image', 'Video', 'Audio', 'Doc']),
};
