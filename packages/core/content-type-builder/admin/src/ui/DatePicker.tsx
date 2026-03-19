import * as React from 'react';

interface DatePickerProps {
  value?: Date | null;
  onChange?: (date: Date | null) => void;
  onClear?: () => void;
  disabled?: boolean;
  placeholder?: string;
  clearLabel?: string;
}

export const DatePicker = ({
  value,
  onChange,
  onClear,
  disabled,
  placeholder,
  clearLabel = 'Clear',
}: DatePickerProps) => {
  const strVal = value ? value.toISOString().slice(0, 10) : '';
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    if (!v) {
      onChange?.(null);
    } else {
      const d = new Date(v);
      if (!Number.isNaN(d.getTime())) onChange?.(d);
    }
  };
  return (
    <div style={{ display: 'flex', gap: 'var(--ctb-space-2)', alignItems: 'center' }}>
      <input
        type="date"
        value={strVal}
        onChange={handleChange}
        disabled={disabled}
        style={{
          padding: 'var(--ctb-space-2) var(--ctb-space-3)',
          border: '1px solid var(--ctb-border)',
          borderRadius: 'var(--ctb-radius-sm)',
          fontSize: 14,
          flex: 1,
          backgroundColor: 'var(--ctb-bg)',
        }}
      />
      {value && onClear && (
        <button type="button" onClick={onClear} style={{ padding: 'var(--ctb-space-2) var(--ctb-space-3)' }}>
          {clearLabel}
        </button>
      )}
    </div>
  );
};
