import * as React from 'react';

import omit from 'lodash/omit';
import { useIntl } from 'react-intl';
import { Navigate, useNavigate, useMatch, useLocation } from 'react-router-dom';
import { styled } from 'styled-components';
import * as yup from 'yup';
import { ValidationError } from 'yup';

import {
  AuthButton,
  AuthCard,
  AuthError,
  AuthInput,
  AuthLink,
  AuthPassword,
  AuthStack,
  AuthSubtitle,
  AuthTitle,
} from '../../../components/Auth';
import { authTheme } from '../../../components/Auth/theme';
import { Form, FormHelpers } from '../../../components/Form';
import { useGuidedTour } from '../../../components/GuidedTour/Provider';
import { useTypedDispatch } from '../../../core/store/hooks';
import { useNotification } from '../../../features/Notifications';
import { useAPIErrorHandler } from '../../../hooks/useAPIErrorHandler';
import { UnauthenticatedLayout } from '../../../layouts/UnauthenticatedLayout';
import { login } from '../../../reducer';
import {
  useGetRegistrationInfoQuery,
  useRegisterAdminMutation,
  useRegisterUserMutation,
} from '../../../services/auth';
import { isBaseQueryError } from '../../../utils/baseQuery';
import { translatedErrors } from '../../../utils/translatedErrors';

import {
  Register as RegisterUser,
  RegisterAdmin,
} from '../../../../../shared/contracts/authentication';

const REGISTER_USER_SCHEMA = yup.object().shape({
  name: yup.string().trim().required(translatedErrors.required).nullable(),
  password: yup
    .string()
    .min(8, {
      id: translatedErrors.minLength.id,
      defaultMessage: '密码至少 8 个字符',
      values: { min: 8 },
    })
    .matches(/[a-z]/, {
      message: {
        id: 'components.Input.error.contain.lowercase',
        defaultMessage: '密码需包含至少 1 个小写字母',
      },
    })
    .matches(/[A-Z]/, {
      message: {
        id: 'components.Input.error.contain.uppercase',
        defaultMessage: '密码需包含至少 1 个大写字母',
      },
    })
    .matches(/\d/, {
      message: {
        id: 'components.Input.error.contain.number',
        defaultMessage: '密码需包含至少 1 个数字',
      },
    })
    .required({
      id: translatedErrors.required.id,
      defaultMessage: '请输入密码',
    })
    .nullable(),
  confirmPassword: yup
    .string()
    .required({
      id: translatedErrors.required.id,
      defaultMessage: '请确认密码',
    })
    .oneOf([yup.ref('password'), null], {
      id: 'components.Input.error.password.noMatch',
      defaultMessage: '两次密码输入不一致',
    })
    .nullable(),
  registrationToken: yup.string().required({
    id: translatedErrors.required.id,
    defaultMessage: '注册令牌必填',
  }),
});

const REGISTER_ADMIN_SCHEMA = yup.object().shape({
  name: yup
    .string()
    .trim()
    .required({
      id: translatedErrors.required.id,
      defaultMessage: '请输入您的姓名',
    })
    .nullable(),
  companyName: yup.string().trim().nullable(),
  password: yup
    .string()
    .min(8, {
      id: translatedErrors.minLength.id,
      defaultMessage: '密码至少 8 个字符',
      values: { min: 8 },
    })
    .matches(/[a-z]/, {
      message: {
        id: 'components.Input.error.contain.lowercase',
        defaultMessage: '密码需包含至少 1 个小写字母',
      },
    })
    .matches(/[A-Z]/, {
      message: {
        id: 'components.Input.error.contain.uppercase',
        defaultMessage: '密码需包含至少 1 个大写字母',
      },
    })
    .matches(/\d/, {
      message: {
        id: 'components.Input.error.contain.number',
        defaultMessage: '密码需包含至少 1 个数字',
      },
    })
    .required({
      id: translatedErrors.required.id,
      defaultMessage: '请输入密码',
    })
    .nullable(),
  confirmPassword: yup
    .string()
    .required({
      id: translatedErrors.required.id,
      defaultMessage: '请确认密码',
    })
    .nullable()
    .oneOf([yup.ref('password'), null], {
      id: 'components.Input.error.password.noMatch',
      defaultMessage: '两次密码输入不一致',
    }),
  email: yup
    .string()
    .email({
      id: translatedErrors.email.id,
      defaultMessage: '请输入有效的邮箱地址',
    })
    .strict()
    .lowercase({
      id: translatedErrors.lowercase.id,
      defaultMessage: '邮箱需为小写',
    })
    .required({
      id: translatedErrors.required.id,
      defaultMessage: '请输入邮箱',
    })
    .nullable(),
});

interface RegisterProps {
  hasAdmin?: boolean;
}

interface RegisterFormValues {
  name: string;
  companyName: string;
  email: string;
  password: string;
  confirmPassword: string;
  registrationToken: string | undefined;
}

const FormSection = styled.div`
  margin-top: ${authTheme.spacing.xl}px;
`;

const FooterLinks = styled.div`
  display: flex;
  justify-content: center;
  margin-top: ${authTheme.spacing.xl}px;
`;

const Register = ({ hasAdmin }: RegisterProps) => {
  const { toggleNotification } = useNotification();
  const navigate = useNavigate();
  const [apiError, setApiError] = React.useState<string>();
  const { formatMessage } = useIntl();
  const setSkipped = useGuidedTour('Register', (state) => state.setSkipped);
  const { search: searchString } = useLocation();
  const query = React.useMemo(() => new URLSearchParams(searchString), [searchString]);
  const match = useMatch('/auth/:authType');
  const {
    _unstableFormatAPIError: formatAPIError,
    _unstableFormatValidationErrors: formatValidationErrors,
  } = useAPIErrorHandler();

  const registrationToken = query.get('registrationToken');

  const { data: userInfo, error } = useGetRegistrationInfoQuery(registrationToken as string, {
    skip: !registrationToken,
  });

  React.useEffect(() => {
    if (error) {
      const message: string = isBaseQueryError(error)
        ? formatAPIError(error)
        : (error.message ?? '');

      toggleNotification({
        type: 'danger',
        message,
      });

      navigate(`/auth/oops?info=${encodeURIComponent(message)}`);
    }
  }, [error, formatAPIError, navigate, toggleNotification]);

  const [registerAdmin] = useRegisterAdminMutation();
  const [registerUser] = useRegisterUserMutation();
  const dispatch = useTypedDispatch();

  const handleRegisterAdmin = async (
    body: RegisterAdmin.Request['body'],
    setFormErrors: FormHelpers<RegisterFormValues>['setErrors']
  ) => {
    const res = await registerAdmin(body);

    if ('data' in res) {
      dispatch(login({ token: res.data.token }));

      const { roles } = res.data.user;

      if (roles) {
        const isUserSuperAdmin = roles.find(({ code }) => code === 'leao-super-admin');

        if (isUserSuperAdmin) {
          localStorage.setItem('GUIDED_TOUR_SKIPPED', JSON.stringify(false));
          setSkipped(false);
        }
      }

      navigate('/');
    } else {
      if (isBaseQueryError(res.error)) {
        if (res.error.name === 'ValidationError') {
          setFormErrors(formatValidationErrors(res.error));
          return;
        }

        setApiError(formatAPIError(res.error));
      }
    }
  };

  const handleRegisterUser = async (
    body: RegisterUser.Request['body'],
    setFormErrors: FormHelpers<RegisterFormValues>['setErrors']
  ) => {
    const res = await registerUser(body);

    if ('data' in res) {
      dispatch(login({ token: res.data.token }));
      navigate('/');
    } else {
      if (isBaseQueryError(res.error)) {
        if (res.error.name === 'ValidationError') {
          setFormErrors(formatValidationErrors(res.error));
          return;
        }

        setApiError(formatAPIError(res.error));
      }
    }
  };

  if (
    !match ||
    (match.params.authType !== 'register' && match.params.authType !== 'register-admin')
  ) {
    return <Navigate to="/" />;
  }

  const isAdminRegistration = match.params.authType === 'register-admin';

  const schema = isAdminRegistration ? REGISTER_ADMIN_SCHEMA : REGISTER_USER_SCHEMA;

  const title = formatMessage({
    id: isAdminRegistration ? 'Auth.form.register-admin.title' : 'Auth.form.register.title',
    defaultMessage: isAdminRegistration ? '创建管理员账户' : '完成注册',
  });
  const subtitle = formatMessage({
    id: isAdminRegistration
      ? 'Auth.form.register-admin.subtitle'
      : 'Auth.form.register.password-subtitle',
    defaultMessage: isAdminRegistration
      ? '填写以下信息，创建您的第一个管理员账户'
      : '设置您的登录密码',
  });

  const passwordHint = formatMessage({
    id: 'Auth.form.password.hint',
    defaultMessage: '至少 8 个字符，包含 1 个大写、1 个小写和 1 个数字',
  });

  return (
    <UnauthenticatedLayout>
      <AuthCard wide>
        <AuthStack gap={authTheme.spacing.md}>
          <div>
            <AuthTitle>{title}</AuthTitle>
            <AuthSubtitle>{subtitle}</AuthSubtitle>
          </div>
          {apiError ? <AuthError>{apiError}</AuthError> : null}
        </AuthStack>

        <Form
          method="POST"
          initialValues={
            {
              name: userInfo?.name || '',
              companyName: userInfo?.companyName || '',
              email: userInfo?.email || '',
              password: '',
              confirmPassword: '',
              registrationToken: registrationToken || undefined,
            } satisfies RegisterFormValues
          }
          onSubmit={async (data, helpers) => {
            const normalizedData = normalizeData(data);

            try {
              await schema.validate(normalizedData, { abortEarly: false });

              if (normalizedData.registrationToken) {
                handleRegisterUser(
                  {
                    userInfo: {
                      name: normalizedData.name,
                      password: normalizedData.password,
                    },
                    registrationToken: normalizedData.registrationToken,
                  },
                  helpers.setErrors
                );
              } else {
                await handleRegisterAdmin(
                  omit(normalizedData, ['registrationToken', 'confirmPassword']),
                  helpers.setErrors
                );
              }
            } catch (err) {
              if (err instanceof ValidationError) {
                helpers.setErrors(
                  err.inner.reduce<Record<string, string>>((acc, { message, path }) => {
                    if (path) {
                      acc[path] =
                        typeof message === 'object'
                          ? formatMessage(message as { id: string; defaultMessage: string })
                          : String(message);
                    }
                    return acc;
                  }, {})
                );
              }
            }
          }}
        >
          <FormSection>
            <AuthStack gap={authTheme.spacing.lg}>
              <AuthInput
                name="name"
                label={formatMessage({ id: 'Auth.form.name.label', defaultMessage: '姓名' })}
                placeholder={formatMessage({
                  id: 'Auth.form.name.placeholder',
                  defaultMessage: '您的姓名或昵称',
                })}
                required
              />
              {isAdminRegistration && (
                <AuthInput
                  name="companyName"
                  label={formatMessage({
                    id: 'Auth.form.companyName.label',
                    defaultMessage: '公司名称',
                  })}
                  placeholder={formatMessage({
                    id: 'Auth.form.companyName.placeholder',
                    defaultMessage: '选填',
                  })}
                />
              )}
              {isAdminRegistration && (
                <AuthInput
                  name="email"
                  label={formatMessage({ id: 'Auth.form.email.label', defaultMessage: '邮箱' })}
                  type="email"
                  placeholder={formatMessage({
                    id: 'Auth.form.email.placeholder.register',
                    defaultMessage: '用于登录和找回密码',
                  })}
                  required
                />
              )}
              <AuthPassword
                name="password"
                label={formatMessage({ id: 'global.password', defaultMessage: '密码' })}
                required
                hint={passwordHint}
              />
              <AuthPassword
                name="confirmPassword"
                label={formatMessage({
                  id: 'Auth.form.confirmPassword.label',
                  defaultMessage: '确认密码',
                })}
                placeholder={formatMessage({
                  id: 'Auth.form.confirmPassword.placeholder',
                  defaultMessage: '再次输入密码',
                })}
                required
              />
              <AuthButton>
                {formatMessage({
                  id: 'Auth.form.button.create-account',
                  defaultMessage: '创建账户',
                })}
              </AuthButton>
            </AuthStack>
          </FormSection>
        </Form>
      </AuthCard>

      {match?.params.authType === 'register' && (
        <FooterLinks>
          <AuthLink to="/auth/login">
            {formatMessage({
              id: 'Auth.link.signin.account',
              defaultMessage: '已有账户？去登录',
            })}
          </AuthLink>
        </FooterLinks>
      )}
    </UnauthenticatedLayout>
  );
};

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string | undefined ? K : never;
}[keyof T];

function normalizeData(data: RegisterFormValues) {
  return Object.entries(data).reduce(
    (acc, [key, value]) => {
      type PasswordKeys = Extract<keyof RegisterFormValues, 'password' | 'confirmPassword'>;
      type RegisterFormStringValues = Exclude<
        keyof Pick<RegisterFormValues, StringKeys<RegisterFormValues>>,
        PasswordKeys
      >;

      if (!['password', 'confirmPassword'].includes(key) && typeof value === 'string') {
        const trimmed = value.trim();
        if (key === 'companyName') {
          acc.companyName = trimmed || undefined;
        } else {
          acc[key as Exclude<RegisterFormStringValues, 'companyName'>] = trimmed;
        }
      } else {
        acc[key as PasswordKeys] = value;
      }

      return acc;
    },
    {} as {
      name: string;
      companyName: string | undefined;
      email: string;
      password: string;
      confirmPassword: string;
      registrationToken: string | undefined;
    }
  );
}

export { Register };
export type { RegisterProps };
