import * as React from 'react';

interface SingleSelectProps {
  children: React.ReactNode;
  disabled?: boolean;
  onChange?: (value: string | number) => void;
  placeholder?: string;
  value?: string | number | null;
}

export const SingleSelect = ({
  children,
  disabled,
  onChange,
  placeholder,
  value = '',
}: SingleSelectProps) => {
  const val = value != null ? String(value) : '';
  const options = React.Children.toArray(children) as React.ReactElement[];
  const selectOptions = options
    .filter((c) => c && typeof c === 'object' && 'props' in c && 'value' in (c.props || {}))
    .map((c) => ({ value: (c.props as any).value, children: (c.props as any).children }));

  return (
    <select
      disabled={disabled}
      value={val}
      onChange={(e) => onChange?.(e.target.value)}
      style={{
        padding: 'var(--ctb-space-2) var(--ctb-space-3)',
        border: '1px solid var(--ctb-border)',
        borderRadius: 'var(--ctb-radius-sm)',
        fontSize: 14,
        width: '100%',
        backgroundColor: 'var(--ctb-bg)',
      }}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {selectOptions.map((opt) => (
        <option key={String(opt.value)} value={String(opt.value)}>
          {opt.children}
        </option>
      ))}
    </select>
  );
};

interface SingleSelectOptionProps {
  value: string | number;
  disabled?: boolean;
  hidden?: boolean;
  children: React.ReactNode;
}

export const SingleSelectOption = (_props: SingleSelectOptionProps) => null;
