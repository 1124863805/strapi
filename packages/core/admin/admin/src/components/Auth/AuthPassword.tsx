import * as React from 'react';
import * as Label from '@radix-ui/react-label';
import { styled } from 'styled-components';

import { useFocusInputField } from '../../hooks/useFocusInputField';
import { useField } from '../Form';

import { authTheme } from './theme';

const FieldRoot = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${authTheme.spacing.xs}px;
`;

const StyledLabel = styled(Label.Root)`
  font-family: ${authTheme.typography.fontFamily};
  font-size: ${authTheme.typography.label.fontSize};
  font-weight: ${authTheme.typography.label.fontWeight};
  color: ${authTheme.colors.text};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${authTheme.spacing.sm + 2}px ${authTheme.spacing.xxl}px ${authTheme.spacing.sm + 2}px
    ${authTheme.spacing.md}px;
  font-family: ${authTheme.typography.fontFamily};
  font-size: ${authTheme.typography.input.fontSize};
  color: ${authTheme.colors.text};
  background: ${authTheme.colors.bgInput};
  border: 1px solid ${(p) => (p.$hasError ? authTheme.colors.error : authTheme.colors.border)};
  border-radius: ${authTheme.radius.sm}px;
  outline: none;
  transition: border-color ${authTheme.transition.fast}, box-shadow ${authTheme.transition.fast};

  &::placeholder {
    color: ${authTheme.colors.textMuted};
  }

  &:focus {
    border-color: ${(p) => (p.$hasError ? authTheme.colors.error : authTheme.colors.borderFocus)};
    box-shadow: ${(p) =>
      p.$hasError ? '0 0 0 3px rgba(220, 38, 38, 0.15)' : authTheme.shadow.focus};
  }
`;

const ToggleButton = styled.button`
  position: absolute;
  right: ${authTheme.spacing.sm}px;
  top: 50%;
  transform: translateY(-50%);
  padding: ${authTheme.spacing.xs}px;
  background: none;
  border: none;
  cursor: pointer;
  color: ${authTheme.colors.textMuted};
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: ${authTheme.radius.sm}px;
  transition: color ${authTheme.transition.fast}, background ${authTheme.transition.fast};

  &:hover {
    color: ${authTheme.colors.text};
    background: rgba(0, 0, 0, 0.04);
  }
`;

const ErrorText = styled.span`
  font-size: ${authTheme.typography.hint.fontSize};
  color: ${authTheme.colors.error};
`;

const HintText = styled.span`
  font-size: ${authTheme.typography.hint.fontSize};
  color: ${authTheme.colors.textMuted};
`;

interface AuthPasswordProps {
  name: string;
  label: React.ReactNode;
  placeholder?: string;
  required?: boolean;
  hint?: string;
}

const AuthPassword = ({ name, label, placeholder, required, hint }: AuthPasswordProps) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const field = useField<string>(name);
  const fieldRef = useFocusInputField<HTMLInputElement>(name);

  return (
    <FieldRoot>
      <StyledLabel htmlFor={name}>
        {label}
        {required && (
          <span style={{ color: authTheme.colors.error, marginLeft: 2 }}>*</span>
        )}
      </StyledLabel>
      <InputWrapper>
        <StyledInput
          ref={fieldRef}
          id={name}
          name={name}
          type={showPassword ? 'text' : 'password'}
          value={field.value ?? ''}
          onChange={(e) => field.onChange(e)}
          placeholder={placeholder}
          required={required}
          autoComplete=""
          $hasError={!!field.error}
          aria-invalid={!!field.error}
          aria-describedby={field.error ? `${name}-error` : hint ? `${name}-hint` : undefined}
        />
        <ToggleButton
          type="button"
          tabIndex={-1}
          onClick={() => setShowPassword((p) => !p)}
          aria-label={showPassword ? '隐藏密码' : '显示密码'}
        >
          {showPassword ? (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
              <line x1="1" y1="1" x2="23" y2="23" />
            </svg>
          ) : (
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
          )}
        </ToggleButton>
      </InputWrapper>
      {hint && !field.error && <HintText id={`${name}-hint`}>{hint}</HintText>}
      {field.error && (
        <ErrorText id={`${name}-error`} data-leao-field-error>
          {field.error}
        </ErrorText>
      )}
    </FieldRoot>
  );
};

export { AuthPassword };
