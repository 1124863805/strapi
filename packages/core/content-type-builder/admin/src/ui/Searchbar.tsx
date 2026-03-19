import * as React from 'react';

interface SearchbarProps {
  name?: string;
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  onBlur?: () => void;
  onClear?: () => void;
  onKeyDown?: (e: React.KeyboardEvent) => void;
  placeholder?: string;
  clearLabel?: string;
  children?: React.ReactNode;
  ref?: React.Ref<HTMLInputElement>;
}

export const Searchbar = React.forwardRef<HTMLInputElement, SearchbarProps>(
  ({ value, onChange, onBlur, onClear, onKeyDown, placeholder, ...rest }, ref) => (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <input
        ref={ref}
        type="search"
        value={value}
        onChange={(e) => onChange?.({ target: { value: e.target.value } })}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        style={{
          padding: 'var(--ctb-space-2) var(--ctb-space-3)',
          paddingRight: value ? 36 : 'var(--ctb-space-3)',
          border: '1px solid var(--ctb-border)',
          borderRadius: 'var(--ctb-radius-sm)',
          fontSize: 14,
          width: '100%',
          backgroundColor: 'var(--ctb-bg)',
        }}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          aria-label={rest.clearLabel}
          style={{
            position: 'absolute',
            right: 'var(--ctb-space-2)',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 'var(--ctb-space-1)',
          }}
        >
          ×
        </button>
      )}
    </div>
  )
);
