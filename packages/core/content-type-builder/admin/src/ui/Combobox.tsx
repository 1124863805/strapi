import * as React from 'react';

interface ComboboxProps {
  children: React.ReactNode;
  value?: string;
  onChange?: (value: string) => void;
  onCreateOption?: (value: string) => void;
  creatable?: boolean;
  disabled?: boolean;
}

export const Combobox = ({
  children,
  value = '',
  onChange,
  onCreateOption,
  creatable,
  disabled,
}: ComboboxProps) => {
  const options = React.Children.toArray(children)
    .filter((c): c is React.ReactElement => c != null && typeof c === 'object' && 'props' in c)
    .map((c) => ({ value: (c.props as any).value, children: (c.props as any).children }));

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const v = e.target.value;
    if (v === '__create__') {
      const newVal = window.prompt('Enter new category name:');
      if (newVal && onCreateOption) {
        onCreateOption(newVal);
        onChange?.(newVal);
      }
    } else {
      onChange?.(v);
    }
  };

  return (
    <select
      value={value}
      onChange={handleSelectChange}
      disabled={disabled}
      style={{
        padding: 'var(--ctb-space-2) var(--ctb-space-3)',
        border: '1px solid var(--ctb-border)',
        borderRadius: 'var(--ctb-radius-sm)',
        fontSize: 14,
        width: '100%',
        backgroundColor: 'var(--ctb-bg)',
      }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.children}
        </option>
      ))}
      {creatable && (
        <option value="__create__">+ Add new</option>
      )}
    </select>
  );
};

interface ComboboxOptionProps {
  value: string;
  children: React.ReactNode;
}

export const ComboboxOption = (_props: ComboboxOptionProps) => null;
