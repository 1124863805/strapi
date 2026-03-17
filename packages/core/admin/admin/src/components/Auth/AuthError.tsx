import * as React from 'react';
import { styled } from 'styled-components';

import { authTheme } from './theme';

const StyledError = styled.div`
  padding: ${authTheme.spacing.md}px ${authTheme.spacing.lg}px;
  font-family: ${authTheme.typography.fontFamily};
  font-size: ${authTheme.typography.input.fontSize};
  color: ${authTheme.colors.error};
  background: ${authTheme.colors.errorBg};
  border-radius: ${authTheme.radius.sm}px;
  border: 1px solid rgba(220, 38, 38, 0.2);
`;

interface AuthErrorProps {
  children: React.ReactNode;
}

const AuthError = ({ children }: AuthErrorProps) => (
  <StyledError id="global-form-error" role="alert" tabIndex={-1}>
    {children}
  </StyledError>
);

export { AuthError };
