import type { ComponentType } from 'react';
import { Box, Flex } from '../../../ui';
import { styled } from 'styled-components';

const Wrapper: ComponentType<any> = styled(Box)`
  position: relative;
  width: 100%;
  &::before {
    content: '';
    position: absolute;
    top: calc(50% - 0px);
    height: 2px;
    width: 100%;
    background-color: var(--ctb-border);
    z-index: 0;
  }
`;

const IconWrapper: ComponentType<any> = styled(Box)<{ $isSelected?: boolean }>`
  background: ${({ $isSelected }) => ($isSelected ? 'var(--ctb-primary-soft)' : 'var(--ctb-bg-elevated)')};
  border: 1px solid ${({ $isSelected }) => ($isSelected ? 'var(--ctb-primary)' : 'var(--ctb-border)')};
  border-radius: var(--ctb-radius-sm);
  z-index: 1;
  flex: 0 0 2.4rem;
  svg {
    width: 2.4rem;
    height: 2.4rem;
    max-width: unset;
    path {
      fill: ${({ $isSelected }) => ($isSelected ? 'var(--ctb-primary)' : 'var(--ctb-text-muted)')};
    }
  }
  &:disabled {
    cursor: not-allowed;
  }
`;

const InfosWrapper = styled(Flex)`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
`;

export { IconWrapper, InfosWrapper, Wrapper };
