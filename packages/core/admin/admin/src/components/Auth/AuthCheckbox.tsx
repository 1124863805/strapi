import * as React from 'react';
import * as Label from '@radix-ui/react-label';
import * as Checkbox from '@radix-ui/react-checkbox';
import { styled } from 'styled-components';

import { useField } from '../Form';

import { authTheme } from './theme';

const FieldRoot = styled.label`
  display: flex;
  align-items: center;
  gap: ${authTheme.spacing.sm}px;
  cursor: pointer;
  font-family: ${authTheme.typography.fontFamily};
  font-size: ${authTheme.typography.input.fontSize};
  color: ${authTheme.colors.text};
`;

const StyledCheckbox = styled(Checkbox.Root)`
  width: 20px;
  height: 20px;
  border: 2px solid ${authTheme.colors.border};
  border-radius: ${authTheme.radius.sm}px;
  background: ${authTheme.colors.bgCard};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: border-color ${authTheme.transition.fast}, background ${authTheme.transition.fast};

  &:hover {
    border-color: ${authTheme.colors.primary};
  }

  &:focus {
    outline: none;
    box-shadow: ${authTheme.shadow.focus};
  }

  &[data-state='checked'] {
    background: ${authTheme.colors.primary};
    border-color: ${authTheme.colors.primary};
  }
`;

const CheckIcon = () => (
  <svg
    width="12"
    height="12"
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

interface AuthCheckboxProps {
  name: string;
  label: React.ReactNode;
}

const AuthCheckbox = ({ name, label }: AuthCheckboxProps) => {
  const field = useField<boolean>(name);

  return (
    <FieldRoot>
      <StyledCheckbox
        id={name}
        checked={field.value ?? false}
        onCheckedChange={(checked) => field.onChange(name, !!checked)}
        aria-label={typeof label === 'string' ? label : undefined}
      >
        <Checkbox.Indicator>
          <CheckIcon />
        </Checkbox.Indicator>
      </StyledCheckbox>
      <Label.Root htmlFor={name}>{label}</Label.Root>
    </FieldRoot>
  );
};

export { AuthCheckbox };
