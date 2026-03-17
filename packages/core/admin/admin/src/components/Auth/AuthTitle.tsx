import * as React from 'react';
import { styled } from 'styled-components';

import { authTheme } from './theme';

const StyledTitle = styled.h1`
  margin: 0;
  font-family: ${authTheme.typography.fontFamily};
  font-size: ${authTheme.typography.title.fontSize};
  font-weight: ${authTheme.typography.title.fontWeight};
  letter-spacing: ${authTheme.typography.title.letterSpacing};
  line-height: ${authTheme.typography.title.lineHeight};
  color: ${authTheme.colors.text};
`;

interface AuthTitleProps {
  children: React.ReactNode;
}

const AuthTitle = ({ children }: AuthTitleProps) => <StyledTitle>{children}</StyledTitle>;

export { AuthTitle };
