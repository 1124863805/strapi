import * as React from 'react';
import styled from 'styled-components';
import { useIntl } from 'react-intl';
import { NavLink, useNavigate } from 'react-router-dom';
import * as yup from 'yup';

import {
  AuthButton,
  AuthCard,
  AuthError,
  AuthInput,
  AuthLink,
  AuthStack,
  AuthSubtitle,
  AuthTitle,
} from '../../../components/Auth';
import { authTheme } from '../../../components/Auth/theme';
import { Form } from '../../../components/Form';
import { useAPIErrorHandler } from '../../../hooks/useAPIErrorHandler';
import { UnauthenticatedLayout } from '../../../layouts/UnauthenticatedLayout';
import { useForgotPasswordMutation } from '../../../services/auth';
import { isBaseQueryError } from '../../../utils/baseQuery';
import { translatedErrors } from '../../../utils/translatedErrors';

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${authTheme.spacing.xl}px;
`;

const ForgotPassword = () => {
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler();

  const [forgotPassword, { error }] = useForgotPasswordMutation();

  const apiError = error
    ? isBaseQueryError(error)
      ? formatAPIError(error)
      : formatMessage({ id: 'notification.error', defaultMessage: 'An error occurred' })
    : null;

  return (
    <UnauthenticatedLayout>
      <AuthCard>
        <AuthStack gap={authTheme.spacing.lg}>
          <AuthTitle>
            {formatMessage({
              id: 'Auth.form.button.password-recovery',
              defaultMessage: '密码恢复',
            })}
          </AuthTitle>
          <AuthSubtitle>
            {formatMessage({
              id: 'Auth.form.forgot-password.subtitle',
              defaultMessage: '输入您的邮箱，我们将发送重置链接',
            })}
          </AuthSubtitle>
          {apiError ? <AuthError>{apiError}</AuthError> : null}
        </AuthStack>
        <Form
          method="POST"
          initialValues={{ email: '' }}
          onSubmit={async (body) => {
            const res = await forgotPassword(body);
            if (!('error' in res)) {
              navigate('/auth/forgot-password-success');
            }
          }}
          validationSchema={yup.object().shape({
            email: yup
              .string()
              .email(translatedErrors.email)
              .required({
                id: translatedErrors.required.id,
                defaultMessage: 'This field is required.',
              })
              .nullable(),
          })}
        >
          <AuthStack gap={authTheme.spacing.lg} style={{ marginTop: authTheme.spacing.xl }}>
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
            <AuthButton>
              {formatMessage({
                id: 'Auth.form.button.forgot-password',
                defaultMessage: '发送邮件',
              })}
            </AuthButton>
          </AuthStack>
        </Form>
      </AuthCard>
      <FooterLinks>
        <AuthLink to="/auth/login">
          {formatMessage({ id: 'Auth.link.ready', defaultMessage: '准备好登录？' })}
        </AuthLink>
      </FooterLinks>
    </UnauthenticatedLayout>
  );
};

export { ForgotPassword };
