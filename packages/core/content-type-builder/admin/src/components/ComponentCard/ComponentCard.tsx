import { Box, Flex, Typography, Cross } from '../../ui';
import get from 'lodash/get';
import { styled } from 'styled-components';

import { useDataManager } from '../../hooks/useDataManager';

import { ComponentIcon } from './ComponentIcon';

interface ComponentCardProps {
  component: string;
  dzName: string;
  index: number;
  isActive?: boolean;
  isInDevelopmentMode?: boolean;
  onClick?: () => void;
}

const CloseButton = styled(Box)`
  position: absolute;
  display: none;
  top: 5px;
  right: 0.8rem;

  svg {
    width: 1rem;
    height: 1rem;

    path {
      fill: var(--ctb-primary);
    }
  }
`;

const ComponentBox = styled(Flex)`
  width: 14rem;
  height: 8rem;
  position: relative;
  border: 1px solid var(--ctb-border);
  background: var(--ctb-bg);
  border-radius: var(--ctb-radius-sm);
  max-width: 100%;

  &.active,
  &:focus,
  &:hover {
    border: 1px solid var(--ctb-primary);
    background: var(--ctb-primary-soft);
    color: var(--ctb-primary);

    ${CloseButton} {
      display: block;
    }

    > div:first-child {
      background: var(--ctb-primary-soft);
      color: var(--ctb-primary);

      svg path {
        fill: var(--ctb-primary);
      }
    }
  }
`;

export const ComponentCard = ({
  component,
  dzName,
  index,
  isActive = false,
  isInDevelopmentMode = false,
  onClick,
}: ComponentCardProps) => {
  const { modifiedData, removeComponentFromDynamicZone } = useDataManager();
  const {
    schema: { icon, displayName },
  } = get(modifiedData, ['components', component], { schema: {} });

  const onClose = (e: any) => {
    e.stopPropagation();
    removeComponentFromDynamicZone(dzName, index);
  };

  return (
    <ComponentBox
      alignItems="center"
      direction="column"
      className={isActive ? 'active' : ''}
      justifyContent="center"
      paddingLeft={4}
      paddingRight={4}
      shrink={0}
      onClick={onClick}
      role="tab"
      tabIndex={isActive ? 0 : -1}
      cursor="pointer"
      aria-selected={isActive}
      aria-controls={`dz-${dzName}-panel-${index}`}
      id={`dz-${dzName}-tab-${index}`}
    >
      <ComponentIcon icon={icon} isActive={isActive} />

      <Box marginTop={1} maxWidth="100%">
        <Typography variant="pi" fontWeight="bold">
          {displayName}
        </Typography>
      </Box>

      {isInDevelopmentMode && (
        <CloseButton tag="button" onClick={onClose}>
          <Cross />
        </CloseButton>
      )}
    </ComponentBox>
  );
};
