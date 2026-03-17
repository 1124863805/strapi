import * as React from 'react';

import camelCase from 'lodash/camelCase';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';
import * as yup from 'yup';

import {
  AuthButton,
  AuthCard,
  AuthCheckbox,
  AuthError,
  AuthInput,
  AuthLink,
  AuthPassword,
  AuthStack,
  AuthSubtitle,
  AuthTitle,
} from '../../../components/Auth';
import { authTheme } from '../../../components/Auth/theme';
import { Form } from '../../../components/Form';
import { useAuth } from '../../../features/Auth';
import { UnauthenticatedLayout } from '../../../layouts/UnauthenticatedLayout';
import { translatedErrors } from '../../../utils/translatedErrors';

import type { Login } from '../../../../../shared/contracts/authentication';

interface LoginProps {
  children?: React.ReactNode;
}

const LOGIN_SCHEMA = yup.object().shape({
  email: yup
    .string()
    .nullable()
    .email({
      id: translatedErrors.email.id,
      defaultMessage: '请输入有效的邮箱地址',
    })
    .required(translatedErrors.required),
  password: yup.string().required(translatedErrors.required).nullable(),
  rememberMe: yup.bool().nullable(),
});

const Header = styled.div`
  margin-bottom: ${authTheme.spacing.xl}px;
`;

const FormSection = styled.div``;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${authTheme.spacing.xl}px;
`;

const Login = ({ children }: LoginProps) => {
  const [apiError, setApiError] = React.useState<string>();
  const { formatMessage } = useIntl();
  const { search: searchString } = useLocation();
  const query = React.useMemo(() => new URLSearchParams(searchString), [searchString]);
  const navigate = useNavigate();

  const { login } = useAuth('Login', (auth) => auth);

  const handleLogin = async (body: Parameters<typeof login>[0]) => {
    setApiError(undefined);

    const res = await login(body);

    if ('error' in res) {
      const message = res.error.message ?? '登录失败，请重试';

      if (camelCase(message).toLowerCase() === 'usernotactive') {
        navigate('/auth/oops');
        return;
      }

      setApiError(message);
    } else {
      const redirectTo = query.get('redirectTo');
      const redirectUrl = redirectTo ? decodeURIComponent(redirectTo) : '/';

      navigate(redirectUrl);
    }
  };

  return (
    <UnauthenticatedLayout>
      <AuthCard>
        <Header>
          <AuthTitle>
            {formatMessage({
              id: 'Auth.form.welcome.title',
              defaultMessage: '欢迎回来',
            })}
          </AuthTitle>
          <AuthSubtitle>
            {formatMessage({
              id: 'Auth.form.welcome.subtitle',
              defaultMessage: '登录您的 Leao 管理后台',
            })}
          </AuthSubtitle>
          {apiError ? <AuthError>{apiError}</AuthError> : null}
        </Header>
        <Form
          method="PUT"
          initialValues={{
            email: '',
            password: '',
            rememberMe: false,
          }}
          onSubmit={(values) => handleLogin(values)}
          validationSchema={LOGIN_SCHEMA}
        >
          <FormSection>
            <AuthStack gap={authTheme.spacing.lg}>
              <AuthInput
                name="email"
                label={formatMessage({ id: 'Auth.form.email.label', defaultMessage: '邮箱' })}
                type="email"
                placeholder={formatMessage({
                  id: 'Auth.form.email.placeholder',
                  defaultMessage: '请输入邮箱',
                })}
                required
              />
              <AuthPassword
                name="password"
                label={formatMessage({ id: 'global.password', defaultMessage: '密码' })}
                required
              />
              <AuthCheckbox
                name="rememberMe"
                label={formatMessage({
                  id: 'Auth.form.rememberMe.label',
                  defaultMessage: '记住我',
                })}
              />
              <AuthButton>
                {formatMessage({ id: 'Auth.form.button.login', defaultMessage: '登录' })}
              </AuthButton>
            </AuthStack>
          </FormSection>
        </Form>
      </AuthCard>
      <FooterLinks>
        <AuthLink to="/auth/forgot-password">
          {formatMessage({
            id: 'Auth.link.forgot-password',
            defaultMessage: '忘记密码？',
          })}
        </AuthLink>
      </FooterLinks>
      {children}
    </UnauthenticatedLayout>
  );
};

export { Login };
export type { LoginProps };
