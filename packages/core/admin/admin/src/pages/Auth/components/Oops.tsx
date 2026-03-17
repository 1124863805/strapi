import * as React from 'react';

import { useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import styled from 'styled-components';

import {
  AuthCard,
  AuthLink,
  AuthStack,
  AuthSubtitle,
  AuthTitle,
} from '../../../components/Auth';
import { authTheme } from '../../../components/Auth/theme';
import { UnauthenticatedLayout } from '../../../layouts/UnauthenticatedLayout';

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${authTheme.spacing.xl}px;
`;

const Oops = () => {
  const { formatMessage } = useIntl();
  const { search: searchString } = useLocation();
  const query = React.useMemo(() => new URLSearchParams(searchString), [searchString]);

  const message =
    query.get('info') ||
    formatMessage({
      id: 'Auth.components.Oops.text',
      defaultMessage: '您的账户已被暂停。',
    });

  return (
    <UnauthenticatedLayout>
      <AuthCard>
        <AuthStack gap={authTheme.spacing.lg}>
          <AuthTitle>
            {formatMessage({ id: 'Auth.components.Oops.title', defaultMessage: 'Oops...' })}
          </AuthTitle>
          <AuthSubtitle>{message}</AuthSubtitle>
          <AuthSubtitle>
            {formatMessage({
              id: 'Auth.components.Oops.text.admin',
              defaultMessage: '如属误判，请联系管理员。',
            })}
          </AuthSubtitle>
        </AuthStack>
      </AuthCard>
      <FooterLinks>
        <AuthLink to="/auth/login">
          {formatMessage({ id: 'Auth.link.signin', defaultMessage: '返回登录' })}
        </AuthLink>
      </FooterLinks>
    </UnauthenticatedLayout>
  );
};

export { Oops };
