import * as React from 'react';

interface ToggleProps {
  checked?: boolean | null;
  disabled?: boolean;
  offLabel?: string;
  onLabel?: string;
  onChange?: (e: { target: { checked: boolean } }) => void;
}

export const Toggle = ({
  checked = false,
  disabled,
  offLabel = 'False',
  onLabel = 'True',
  onChange,
}: ToggleProps) => {
  const isOn = checked === true;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--ctb-space-2)' }}>
      <span style={{ fontSize: 14, color: !isOn ? 'var(--ctb-primary)' : 'var(--ctb-text-muted)' }}>{offLabel}</span>
      <button
        type="button"
        role="switch"
        aria-checked={isOn}
        disabled={disabled}
        onClick={() => onChange?.({ target: { checked: !isOn } })}
        style={{
          width: 36,
          height: 20,
          borderRadius: 'var(--ctb-radius-sm)',
          border: '1px solid var(--ctb-border)',
          background: isOn ? 'var(--ctb-primary)' : 'var(--ctb-bg-active)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          padding: 0,
          position: 'relative',
        }}
      >
        <span
          style={{
            position: 'absolute',
            top: 2,
            left: isOn ? 18 : 2,
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: 'var(--ctb-bg-elevated)',
            transition: 'left 0.2s ease',
          }}
        />
      </button>
      <span style={{ fontSize: 14, color: isOn ? 'var(--ctb-primary)' : 'var(--ctb-text-muted)' }}>{onLabel}</span>
    </div>
  );
};
