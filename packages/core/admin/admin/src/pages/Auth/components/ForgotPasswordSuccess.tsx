import { useIntl } from 'react-intl';
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

const ForgotPasswordSuccess = () => {
  const { formatMessage } = useIntl();

  return (
    <UnauthenticatedLayout>
      <AuthCard>
        <AuthStack gap={authTheme.spacing.lg}>
          <AuthTitle>
            {formatMessage({
              id: 'app.containers.AuthPage.ForgotPasswordSuccess.title',
              defaultMessage: '邮件已发送',
            })}
          </AuthTitle>
          <AuthSubtitle>
            {formatMessage({
              id: 'app.containers.AuthPage.ForgotPasswordSuccess.text.email',
              defaultMessage: '密码重置链接可能需要几分钟才能到达您的邮箱。',
            })}
          </AuthSubtitle>
          <AuthSubtitle>
            {formatMessage({
              id: 'app.containers.AuthPage.ForgotPasswordSuccess.text.contact-admin',
              defaultMessage: '如未收到链接，请联系管理员。',
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

export { ForgotPasswordSuccess };
