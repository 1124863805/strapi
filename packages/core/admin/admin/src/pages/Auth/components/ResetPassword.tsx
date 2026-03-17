import * as React from 'react';

import { useIntl } from 'react-intl';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import * as yup from 'yup';

import type { ResetPassword as ResetPasswordContract } from '../../../../../shared/contracts/authentication';
import {
  AuthButton,
  AuthCard,
  AuthError,
  AuthLink,
  AuthPassword,
  AuthStack,
  AuthTitle,
} from '../../../components/Auth';
import { authTheme } from '../../../components/Auth/theme';
import { Form } from '../../../components/Form';
import { useTypedDispatch } from '../../../core/store/hooks';
import { useAPIErrorHandler } from '../../../hooks/useAPIErrorHandler';
import { UnauthenticatedLayout } from '../../../layouts/UnauthenticatedLayout';
import { login } from '../../../reducer';
import { useResetPasswordMutation } from '../../../services/auth';
import { isBaseQueryError } from '../../../utils/baseQuery';
import { translatedErrors } from '../../../utils/translatedErrors';

const RESET_PASSWORD_SCHEMA = yup.object().shape({
  password: yup
    .string()
    .min(8, {
      id: translatedErrors.minLength.id,
      defaultMessage: 'Password must be at least 8 characters',
      values: { min: 8 },
    })
    .matches(/[a-z]/, {
      message: {
        id: 'components.Input.error.contain.lowercase',
        defaultMessage: 'Password must contain at least 1 lowercase letter',
      },
    })
    .matches(/[A-Z]/, {
      message: {
        id: 'components.Input.error.contain.uppercase',
        defaultMessage: 'Password must contain at least 1 uppercase letter',
      },
    })
    .matches(/\d/, {
      message: {
        id: 'components.Input.error.contain.number',
        defaultMessage: 'Password must contain at least 1 number',
      },
    })
    .required({
      id: translatedErrors.required.id,
      defaultMessage: 'Password is required',
    })
    .nullable(),
  confirmPassword: yup
    .string()
    .required({
      id: translatedErrors.required.id,
      defaultMessage: 'Confirm password is required',
    })
    .oneOf([yup.ref('password'), null], {
      id: 'components.Input.error.password.noMatch',
      defaultMessage: 'Passwords must match',
    })
    .nullable(),
});

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${authTheme.spacing.xl}px;
`;

const ResetPassword = () => {
  const { formatMessage } = useIntl();
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();
  const { search: searchString } = useLocation();
  const query = React.useMemo(() => new URLSearchParams(searchString), [searchString]);
  const { _unstableFormatAPIError: formatAPIError } = useAPIErrorHandler();

  const [resetPassword, { error }] = useResetPasswordMutation();

  const handleSubmit = async (body: ResetPasswordContract.Request['body']) => {
    const res = await resetPassword(body);

    if ('data' in res) {
      dispatch(login({ token: res.data.token }));
      navigate('/');
    }
  };

  if (!query.get('code')) {
    return <Navigate to="/auth/login" />;
  }

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
              id: 'global.reset-password',
              defaultMessage: '重置密码',
            })}
          </AuthTitle>
          {apiError ? <AuthError>{apiError}</AuthError> : null}
        </AuthStack>
        <Form
          method="POST"
          initialValues={{ password: '', confirmPassword: '' }}
          onSubmit={(values) => {
            handleSubmit({
              password: values.password,
              resetPasswordToken: query.get('code')!,
            });
          }}
          validationSchema={RESET_PASSWORD_SCHEMA}
        >
          <AuthStack gap={authTheme.spacing.lg} style={{ marginTop: authTheme.spacing.xl }}>
            <AuthPassword
              name="password"
              label={formatMessage({ id: 'global.password', defaultMessage: '密码' })}
              required
              hint={formatMessage({
                id: 'Auth.form.password.hint',
                defaultMessage:
                  '密码至少 8 位，包含 1 个大写、1 个小写和 1 个数字',
              })}
            />
            <AuthPassword
              name="confirmPassword"
              label={formatMessage({
                id: 'Auth.form.confirmPassword.label',
                defaultMessage: '确认密码',
              })}
              required
            />
            <AuthButton>
              {formatMessage({
                id: 'global.change-password',
                defaultMessage: '修改密码',
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

export { ResetPassword };
