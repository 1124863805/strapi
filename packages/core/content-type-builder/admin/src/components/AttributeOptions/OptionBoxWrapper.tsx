import type { ComponentType } from 'react';
import { Box } from '@leao1/design-system';
import { styled } from 'styled-components';

export const OptionBoxWrapper: ComponentType<any> = styled(Box)`
  width: 100%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.colors.neutral200};
  text-align: left;
  &:hover {
    cursor: pointer;
    background: ${({ theme }) => theme.colors.primary100};
    border: 1px solid ${({ theme }) => theme.colors.primary200};
  }
`;
