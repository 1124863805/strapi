import * as React from 'react';

import { Box, Button, Flex, Grid, Typography, Link } from '@leao/design-system';
import omit from 'lodash/omit';
import { useIntl } from 'react-intl';
import { NavLink, Navigate, useNavigate, useMatch, useLocation } from 'react-router-dom';
import { styled } from 'styled-components';
import * as yup from 'yup';
import { ValidationError } from 'yup';

import {
  Register as RegisterUser,
  RegisterAdmin,
} from '../../../../../shared/contracts/authentication';
import { Form, FormHelpers } from '../../../components/Form';
import { InputRenderer } from '../../../components/FormInputs/Renderer';
import { useGuidedTour } from '../../../components/GuidedTour/Provider';
import { useNpsSurveySettings } from '../../../components/NpsSurvey';
import { Logo } from '../../../components/UnauthenticatedLogo';
import { useTypedDispatch } from '../../../core/store/hooks';
import { useNotification } from '../../../features/Notifications';
import { useTracking } from '../../../features/Tracking';
import { useAPIErrorHandler } from '../../../hooks/useAPIErrorHandler';
import { LayoutContent, UnauthenticatedLayout } from '../../../layouts/UnauthenticatedLayout';
import { login } from '../../../reducer';
import {
  useGetRegistrationInfoQuery,
  useRegisterAdminMutation,
  useRegisterUserMutation,
} from '../../../services/auth';
import { isBaseQueryError } from '../../../utils/baseQuery';
import { translatedErrors } from '../../../utils/translatedErrors';

const REGISTER_USER_SCHEMA = yup.object().shape({
  firstname: yup.string().trim().required(translatedErrors.required).nullable(),
  lastname: yup.string().nullable(),
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
  registrationToken: yup.string().required({
    id: translatedErrors.required.id,
    defaultMessage: 'Registration token is required',
  }),
});

const REGISTER_ADMIN_SCHEMA = yup.object().shape({
  firstname: yup
    .string()
    .trim()
    .required({
      id: translatedErrors.required.id,
      defaultMessage: 'Firstname is required',
    })
    .nullable(),
  lastname: yup.string().nullable(),
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
      id: translatedErrors.required,
      defaultMessage: 'Confirm password is required',
    })
    .nullable()
    .oneOf([yup.ref('password'), null], {
      id: 'components.Input.error.password.noMatch',
      defaultMessage: 'Passwords must match',
    }),
  email: yup
    .string()
    .email({
      id: translatedErrors.email.id,
      defaultMessage: 'Not a valid email',
    })
    .strict()
    .lowercase({
      id: translatedErrors.lowercase.id,
      defaultMessage: 'Email must be lowercase',
    })
    .required({
      id: translatedErrors.required.id,
      defaultMessage: 'Email is required',
    })
    .nullable(),
});

interface RegisterProps {
  hasAdmin?: boolean;
}

interface RegisterFormValues {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  registrationToken: string | undefined;
  news: boolean;
}

const Register = ({ hasAdmin }: RegisterProps) => {
  const { toggleNotification } = useNotification();
  const navigate = useNavigate();
  const [submitCount, setSubmitCount] = React.useState(0);
  const [apiError, setApiError] = React.useState<string>();
  const { trackUsage } = useTracking();
  const { formatMessage } = useIntl();
  const setSkipped = useGuidedTour('Register', (state) => state.setSkipped);
  const { search: searchString } = useLocation();
  const query = React.useMemo(() => new URLSearchParams(searchString), [searchString]);
  const match = useMatch('/auth/:authType');
  const {
    _unstableFormatAPIError: formatAPIError,
    _unstableFormatValidationErrors: formatValidationErrors,
  } = useAPIErrorHandler();
  const { setNpsSurveySettings } = useNpsSurveySettings();

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
    { news, ...body }: RegisterAdmin.Request['body'] & { news: boolean },
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
          trackUsage('didLaunchGuidedtour');
        }
      }

      if (news) {
        // Only enable EE survey if user accepted the newsletter
        setNpsSurveySettings((s) => ({ ...s, enabled: true }));

        navigate({
          pathname: '/usecase',
          search: `?hasAdmin=${true}`,
        });
      } else {
        navigate('/');
      }
    } else {
      if (isBaseQueryError(res.error)) {
        trackUsage('didNotCreateFirstAdmin');

        if (res.error.name === 'ValidationError') {
          setFormErrors(formatValidationErrors(res.error));
          return;
        }

        setApiError(formatAPIError(res.error));
      }
    }
  };

  const handleRegisterUser = async (
    { news, ...body }: RegisterUser.Request['body'] & { news: boolean },
    setFormErrors: FormHelpers<RegisterFormValues>['setErrors']
  ) => {
    const res = await registerUser(body);

    if ('data' in res) {
      dispatch(login({ token: res.data.token }));

      if (news) {
        // Only enable EE survey if user accepted the newsletter
        setNpsSurveySettings((s) => ({ ...s, enabled: true }));

        navigate({
          pathname: '/usecase',
          search: `?hasAdmin=${hasAdmin}`,
        });
      } else {
        navigate('/');
      }
    } else {
      if (isBaseQueryError(res.error)) {
        trackUsage('didNotCreateFirstAdmin');

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

  const titleId = isAdminRegistration ? 'Auth.form.register-admin.title' : 'Auth.form.welcome.title';
  const subtitleId = isAdminRegistration
    ? 'Auth.form.register-admin.subtitle'
    : 'Auth.form.register.subtitle';

  return (
    <UnauthenticatedLayout>
      <LayoutContent>
        <Flex direction="column" alignItems="center" gap={3}>
          <Logo />

          <Typography tag="h1" variant="alpha" textAlign="center">
            {formatMessage({
              id: titleId,
              defaultMessage: isAdminRegistration ? '创建管理员账户' : '欢迎使用 Leao!',
            })}
          </Typography>
          <Typography variant="epsilon" textColor="neutral600" textAlign="center">
            {formatMessage({
              id: subtitleId,
              defaultMessage: isAdminRegistration
                ? '设置您的第一个管理员账户，用于登录管理后台。'
                : '凭证仅用于在 Leao 中进行身份验证。所有保存的数据都将存储在您的数据库中。',
            })}
          </Typography>
          {apiError ? (
            <Typography id="global-form-error" role="alert" tabIndex={-1} textColor="danger600">
              {apiError}
            </Typography>
          ) : null}
        </Flex>
        <Form
          method="POST"
          initialValues={
            {
              firstname: userInfo?.firstname || '',
              lastname: userInfo?.lastname || '',
              email: userInfo?.email || '',
              password: '',
              confirmPassword: '',
              registrationToken: registrationToken || undefined,
              news: false,
            } satisfies RegisterFormValues
          }
          onSubmit={async (data, helpers) => {
            const normalizedData = normalizeData(data);

            try {
              await schema.validate(normalizedData, { abortEarly: false });

              if (submitCount > 0 && isAdminRegistration) {
                trackUsage('didSubmitWithErrorsFirstAdmin', { count: submitCount.toString() });
              }

              if (normalizedData.registrationToken) {
                handleRegisterUser(
                  {
                    userInfo: omit(normalizedData, [
                      'registrationToken',
                      'confirmPassword',
                      'email',
                      'news',
                    ]),
                    registrationToken: normalizedData.registrationToken,
                    news: normalizedData.news,
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
                    if (path && typeof message === 'object') {
                      acc[path] = formatMessage(message);
                    }
                    return acc;
                  }, {})
                );
              }
              setSubmitCount(submitCount + 1);
            }
          }}
        >
          <Flex direction="column" alignItems="stretch" gap={6} marginTop={7}>
            <Grid.Root gap={4}>
              <Grid.Item col={6} direction="column" alignItems="stretch">
                <InputRenderer
                  label={formatMessage({
                    id: 'Auth.form.firstname.label',
                    defaultMessage: '名字',
                  })}
                  name="firstname"
                  required
                  type="string"
                />
              </Grid.Item>
              <Grid.Item col={6} direction="column" alignItems="stretch">
                <InputRenderer
                  label={formatMessage({
                    id: 'Auth.form.lastname.label',
                    defaultMessage: '姓氏',
                  })}
                  name="lastname"
                  type="string"
                />
              </Grid.Item>
              <Grid.Item col={12} direction="column" alignItems="stretch">
                <InputRenderer
                  disabled={!isAdminRegistration}
                  label={formatMessage({
                    id: 'Auth.form.email.label',
                    defaultMessage: '电子邮件',
                  })}
                  name="email"
                  required
                  type="email"
                />
              </Grid.Item>
              <Grid.Item col={12} direction="column" alignItems="stretch">
                <InputRenderer
                  hint={formatMessage({
                    id: 'Auth.form.password.hint',
                    defaultMessage: '至少 8 个字符，包含 1 个大写、1 个小写和 1 个数字',
                  })}
                  label={formatMessage({
                    id: 'global.password',
                    defaultMessage: '密码',
                  })}
                  name="password"
                  required
                  type="password"
                />
              </Grid.Item>
              <Grid.Item col={12} direction="column" alignItems="stretch">
                <InputRenderer
                  label={formatMessage({
                    id: 'Auth.form.confirmPassword.label',
                    defaultMessage: '确认密码',
                  })}
                  name="confirmPassword"
                  required
                  type="password"
                />
              </Grid.Item>
              <Grid.Item col={12} direction="column" alignItems="stretch">
                <InputRenderer
                  label={formatMessage(
                    {
                      id: 'Auth.form.register.news.label',
                      defaultMessage:
                        '接收新功能与改进更新（即表示接受{terms}和{policy}）',
                    },
                    {
                      terms: (
                        <A target="_blank" href="#" rel="noreferrer">
                          {formatMessage({
                            id: 'Auth.privacy-policy-agreement.terms',
                            defaultMessage: '条款',
                          })}
                        </A>
                      ),
                      policy: (
                        <A target="_blank" href="#" rel="noreferrer">
                          {formatMessage({
                            id: 'Auth.privacy-policy-agreement.policy',
                            defaultMessage: '隐私政策',
                          })}
                        </A>
                      ),
                    }
                  )}
                  name="news"
                  type="checkbox"
                />
              </Grid.Item>
            </Grid.Root>
            <Button fullWidth size="L" type="submit">
              {formatMessage({
                id: 'Auth.form.button.register',
                defaultMessage: '开始使用',
              })}
            </Button>
          </Flex>
        </Form>
        {match?.params.authType === 'register' && (
          <Box paddingTop={4}>
            <Flex justifyContent="center">
              <Link tag={NavLink} to="/auth/login">
                {formatMessage({
                  id: 'Auth.link.signin.account',
                  defaultMessage: '已有账户？去登录',
                })}
              </Link>
            </Flex>
          </Box>
        )}
      </LayoutContent>
    </UnauthenticatedLayout>
  );
};

interface RegisterFormValues {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  confirmPassword: string;
  registrationToken: string | undefined;
  news: boolean;
}

type StringKeys<T> = {
  [K in keyof T]: T[K] extends string | undefined ? K : never;
}[keyof T];

/**
 * @description Trims all values but the password & sets lastName to null if it's a falsey value.
 */
function normalizeData(data: RegisterFormValues) {
  return Object.entries(data).reduce(
    (acc, [key, value]) => {
      type PasswordKeys = Extract<keyof RegisterFormValues, 'password' | 'confirmPassword'>;
      type RegisterFormStringValues = Exclude<
        keyof Pick<RegisterFormValues, StringKeys<RegisterFormValues>>,
        PasswordKeys
      >;

      if (!['password', 'confirmPassword'].includes(key) && typeof value === 'string') {
        acc[key as RegisterFormStringValues] = value.trim();

        if (key === 'lastname') {
          acc[key] = value || undefined;
        }
      } else {
        acc[key as PasswordKeys] = value;
      }

      return acc;
    },
    {} as {
      firstname: string;
      lastname: string | undefined;
      email: string;
      password: string;
      confirmPassword: string;
      registrationToken: string | undefined;
      news: boolean;
    }
  );
}

const A = styled.a`
  color: ${({ theme }) => theme.colors.primary600};
`;

export { Register };
export type { RegisterProps };
