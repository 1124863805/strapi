import * as React from 'react';
import { styled } from 'styled-components';

import { authTheme } from './theme';

const StyledCard = styled.div<{ $wide?: boolean }>`
  width: 100%;
  max-width: ${(p) => (p.$wide ? 600 : 520)}px;
  margin: 0 auto;
  padding: ${authTheme.spacing.xxl}px;
  border-radius: ${authTheme.radius.xl}px;
  background: ${authTheme.colors.bgCard};
  box-shadow: ${authTheme.shadow.card};
  border: 1px solid rgba(0, 0, 0, 0.04);
  transition: box-shadow ${authTheme.transition.normal};

  &:hover {
    box-shadow: ${authTheme.shadow.cardHover};
  }
`;

interface AuthCardProps {
  children: React.ReactNode;
  wide?: boolean;
}

const AuthCard = ({ children, wide }: AuthCardProps) => (
  <StyledCard $wide={wide}>{children}</StyledCard>
);

export { AuthCard };
