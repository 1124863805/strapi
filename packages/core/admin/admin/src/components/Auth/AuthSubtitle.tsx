import * as React from 'react';
import { styled } from 'styled-components';

import { authTheme } from './theme';

const StyledSubtitle = styled.p`
  margin: 0;
  font-family: ${authTheme.typography.fontFamily};
  font-size: ${authTheme.typography.subtitle.fontSize};
  font-weight: ${authTheme.typography.subtitle.fontWeight};
  line-height: ${authTheme.typography.subtitle.lineHeight};
  color: ${authTheme.colors.textMuted};
`;

interface AuthSubtitleProps {
  children: React.ReactNode;
}

const AuthSubtitle = ({ children }: AuthSubtitleProps) => (
  <StyledSubtitle>{children}</StyledSubtitle>
);

export { AuthSubtitle };
