import * as React from 'react';

interface IconButtonProps {
  children?: React.ReactNode;
  onClick?: () => void;
  label?: string;
  variant?: string;
  withTooltip?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, onClick, label, variant = 'ghost', ...rest }, ref) => (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      aria-label={label}
      style={{
        background: 'none',
        border: 'none',
        padding: 'var(--ctb-space-2)',
        cursor: 'pointer',
        color: 'var(--ctb-text-muted)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      {...rest}
    >
      {children}
    </button>
  )
);
