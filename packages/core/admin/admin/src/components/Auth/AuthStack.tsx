import * as React from 'react';
import { styled } from 'styled-components';

import { authTheme } from './theme';

const StyledStack = styled.div<{ $gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.$gap ?? authTheme.spacing.lg}px;
`;

interface AuthStackProps {
  children: React.ReactNode;
  gap?: number;
}

const AuthStack = ({ children, gap }: AuthStackProps) => (
  <StyledStack $gap={gap}>{children}</StyledStack>
);

export { AuthStack };
