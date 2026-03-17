import * as React from 'react';
import { styled } from 'styled-components';

import { authTheme } from './theme';

const StyledButton = styled.button`
  width: 100%;
  padding: ${authTheme.spacing.md}px ${authTheme.spacing.lg}px;
  font-family: ${authTheme.typography.fontFamily};
  font-size: ${authTheme.typography.button.fontSize};
  font-weight: ${authTheme.typography.button.fontWeight};
  color: ${authTheme.colors.textInverse};
  background: ${authTheme.colors.primary};
  border: none;
  border-radius: ${authTheme.radius.md}px;
  cursor: pointer;
  transition: background ${authTheme.transition.fast}, box-shadow ${authTheme.transition.fast};

  &:hover {
    background: ${authTheme.colors.primaryHover};
    box-shadow: 0 2px 8px rgba(5, 150, 105, 0.35);
  }

  &:active {
    box-shadow: none;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const AuthButton = ({ children, type = 'submit', ...props }: AuthButtonProps) => (
  <StyledButton type={type} {...props}>
    {children}
  </StyledButton>
);

export { AuthButton };
