import * as React from 'react';
import { styled } from 'styled-components';

import { authTheme } from './theme';

const Section = styled.section`
  & + & {
    margin-top: ${authTheme.spacing.xl}px;
    padding-top: ${authTheme.spacing.xl}px;
    border-top: 1px solid ${authTheme.colors.border};
  }
`;

const SectionTitle = styled.h3`
  margin: 0 0 ${authTheme.spacing.md}px;
  font-family: ${authTheme.typography.fontFamily};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.02em;
  text-transform: uppercase;
  color: ${authTheme.colors.textMuted};
`;

interface AuthSectionProps {
  title?: React.ReactNode;
  children: React.ReactNode;
}

const AuthSection = ({ title, children }: AuthSectionProps) => (
  <Section>
    {title && <SectionTitle>{title}</SectionTitle>}
    {children}
  </Section>
);

export { AuthSection };
