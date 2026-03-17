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
  letter-spacing: ${authTheme.typography.label.letterSpacing};
`;

const StyledInput = styled.input<{ $hasError?: boolean }>`
  width: 100%;
  padding: ${authTheme.spacing.sm + 2}px ${authTheme.spacing.md}px;
  font-family: ${authTheme.typography.fontFamily};
  font-size: ${authTheme.typography.input.fontSize};
  font-weight: ${authTheme.typography.input.fontWeight};
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

const ErrorText = styled.span`
  font-size: ${authTheme.typography.hint.fontSize};
  color: ${authTheme.colors.error};
`;

const HintText = styled.span`
  font-size: ${authTheme.typography.hint.fontSize};
  color: ${authTheme.colors.textMuted};
`;

interface AuthInputProps {
  name: string;
  label: React.ReactNode;
  type?: 'text' | 'email';
  placeholder?: string;
  required?: boolean;
  hint?: string;
}

const AuthInput = ({ name, label, type = 'text', placeholder, required, hint }: AuthInputProps) => {
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
      <StyledInput
        ref={fieldRef}
        id={name}
        name={name}
        type={type}
        value={field.value ?? ''}
        onChange={(e) => field.onChange(e)}
        placeholder={placeholder}
        required={required}
        $hasError={!!field.error}
        aria-invalid={!!field.error}
        aria-describedby={field.error ? `${name}-error` : hint ? `${name}-hint` : undefined}
      />
      {hint && !field.error && (
        <HintText id={`${name}-hint`}>{hint}</HintText>
      )}
      {field.error && (
        <ErrorText id={`${name}-error`} data-leao-field-error>
          {field.error}
        </ErrorText>
      )}
    </FieldRoot>
  );
};

export { AuthInput };
