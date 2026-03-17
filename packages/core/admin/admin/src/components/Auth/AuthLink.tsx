import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from 'styled-components';

import { authTheme } from './theme';

const StyledLink = styled(NavLink)`
  font-family: ${authTheme.typography.fontFamily};
  font-size: ${authTheme.typography.input.fontSize};
  font-weight: 500;
  color: ${authTheme.colors.primary};
  text-decoration: none;
  transition: color ${authTheme.transition.fast};

  &:hover {
    color: ${authTheme.colors.primaryHover};
    text-decoration: underline;
  }
`;

interface AuthLinkProps {
  to: string;
  children: React.ReactNode;
}

const AuthLink = ({ to, children }: AuthLinkProps) => <StyledLink to={to}>{children}</StyledLink>;

export { AuthLink };
