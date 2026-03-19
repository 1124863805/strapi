import * as React from 'react';

interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  id?: string;
  name?: string;
  onCheckedChange?: (checked: boolean) => void;
  children?: React.ReactNode;
}

export const Checkbox = ({ checked, disabled, id, name, onCheckedChange, children }: CheckboxProps) => (
  <label
    className="ctb-root"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--ctb-space-3)',
      cursor: disabled ? 'not-allowed' : 'pointer',
      fontSize: 14,
      color: 'var(--ctb-text)',
      fontFamily: 'var(--ctb-font, "PingFang SC", "Microsoft YaHei", "Hiragino Sans GB", sans-serif)',
    }}
  >
    <input
      type="checkbox"
      id={id}
      name={name}
      checked={checked}
      disabled={disabled}
      onChange={(e) => onCheckedChange?.(e.target.checked)}
      style={{
        width: 16,
        height: 16,
        accentColor: 'var(--ctb-primary)',
      }}
    />
    {children}
  </label>
);
