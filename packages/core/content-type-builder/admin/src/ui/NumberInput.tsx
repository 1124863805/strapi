import * as React from 'react';

interface NumberInputProps {
  value?: number | string | null;
  onChange?: (value: number | null) => void;
  onValueChange?: (value: number | null) => void;
  disabled?: boolean;
  placeholder?: string;
  step?: number;
}

export const NumberInput = ({
  value,
  onValueChange,
  onChange,
  disabled,
  placeholder,
  step,
}: NumberInputProps) => {
  const strVal = value != null && value !== '' ? String(value) : '';
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (v === '') {
      (onValueChange ?? onChange)?.(null);
    } else {
      const n = parseFloat(v);
      if (!Number.isNaN(n)) {
        (onValueChange ?? onChange)?.(n);
      }
    }
  };
  return (
    <input
      type="number"
      value={strVal}
      onChange={handleChange}
      disabled={disabled}
      placeholder={placeholder}
      step={step}
      style={{
        padding: 'var(--ctb-space-2) var(--ctb-space-3)',
        border: '1px solid var(--ctb-border)',
        borderRadius: 'var(--ctb-radius-sm)',
        fontSize: 14,
        width: '100%',
        boxSizing: 'border-box',
        backgroundColor: 'var(--ctb-bg)',
      }}
    />
  );
};
