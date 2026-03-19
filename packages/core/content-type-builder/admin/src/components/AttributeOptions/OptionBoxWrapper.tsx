import type { ComponentType } from 'react';
import { Box } from '../../ui';
import { styled } from 'styled-components';

export const OptionBoxWrapper: ComponentType<any> = styled(Box)`
  width: 100%;
  height: 100%;
  min-height: 56px;
  padding: var(--ctb-space-3);
  border: 1px solid var(--ctb-border);
  border-radius: var(--ctb-radius-sm);
  text-align: left;
  transition: border-color 0.2s var(--ctb-ease), background 0.2s var(--ctb-ease);
  &:hover {
    cursor: pointer;
    background: var(--ctb-primary-soft);
    border-color: var(--ctb-primary);
  }
`;
