import * as React from 'react';

interface TimePickerProps {
  value?: string | null;
  onChange?: (time: string | undefined) => void;
  onClear?: () => void;
  disabled?: boolean;
  clearLabel?: string;
}

export const TimePicker = ({
  value,
  onChange,
  onClear,
  disabled,
  clearLabel = 'Clear',
}: TimePickerProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value || undefined);
  };
  return (
    <div style={{ display: 'flex', gap: 'var(--ctb-space-2)', alignItems: 'center' }}>
      <input
        type="time"
        value={value ?? ''}
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
