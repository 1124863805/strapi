import * as React from 'react';

import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

import { AuthGlobalStyle } from '../components/Auth/AuthGlobalStyle';
import { authTheme } from '../components/Auth/theme';
import { useTypedDispatch, useTypedSelector } from '../core/store/hooks';
import { setLocale } from '../reducer';

const PageWrapper = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: flex-end;
  padding: ${authTheme.spacing.lg}px ${authTheme.spacing.xl}px;
`;

const LocaleSelect = styled.select`
  padding: ${authTheme.spacing.sm}px ${authTheme.spacing.md}px;
  font-family: ${authTheme.typography.fontFamily};
  font-size: ${authTheme.typography.input.fontSize};
  color: ${authTheme.colors.text};
  background: ${authTheme.colors.bgCard};
  border: 1px solid ${authTheme.colors.border};
  border-radius: ${authTheme.radius.sm}px;
  cursor: pointer;
  transition: border-color ${authTheme.transition.fast}, box-shadow ${authTheme.transition.fast};

  &:focus {
    outline: none;
    border-color: ${authTheme.colors.primary};
    box-shadow: ${authTheme.shadow.focus};
  }
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: ${authTheme.spacing.xl}px;
`;

const Wrapper = styled.div`
  margin: 0 auto;
  width: 552px;
  padding: ${authTheme.spacing.xl}px ${authTheme.spacing.xxl}px;
  border-radius: ${authTheme.radius.lg}px;
  box-shadow: ${authTheme.shadow.card};
  background: ${authTheme.colors.bgCard};
  border: 1px solid rgba(0, 0, 0, 0.04);
`;

export const Column = styled.div<{ gap?: number }>`
  display: flex;
  flex-direction: column;
  gap: ${(p) => p.gap ?? authTheme.spacing.lg}px;
`;

const LocaleToggle = () => {
  const localeNames = useTypedSelector((state) => state.admin_app.language.localeNames);
  const dispatch = useTypedDispatch();
  const { formatMessage, locale } = useIntl();

  return (
    <LocaleSelect
      aria-label={formatMessage({
        id: 'global.localeToggle.label',
        defaultMessage: 'Select interface language',
      })}
      value={locale}
      onChange={(e) => dispatch(setLocale(e.target.value))}
    >
      {Object.entries(localeNames).map(([language, name]) => (
        <option key={language} value={language}>
          {name}
        </option>
      ))}
    </LocaleSelect>
  );
};

interface LayoutContentProps {
  children: React.ReactNode;
}

export const LayoutContent = ({ children }: LayoutContentProps) => (
  <Wrapper>{children}</Wrapper>
);

interface UnauthenticatedLayoutProps {
  children: React.ReactNode;
}

export const UnauthenticatedLayout = ({ children }: UnauthenticatedLayoutProps) => (
  <PageWrapper data-auth-page>
    <link
      rel="stylesheet"
      href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600&display=swap"
    />
    <AuthGlobalStyle />
    <Header>
      <LocaleToggle />
    </Header>
    <Content>{children}</Content>
  </PageWrapper>
);
