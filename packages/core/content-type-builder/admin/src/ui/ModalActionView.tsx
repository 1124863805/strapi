import * as React from 'react';

type Variant = 'primary' | 'secondary' | 'tertiary' | 'danger';

interface ModalActionViewProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  type?: 'button' | 'submit';
  variant?: Variant;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const ModalActionView = ({
  type = 'button',
  variant = 'secondary',
  icon,
  children,
  className = '',
  style,
  ...rest
}: ModalActionViewProps): React.ReactElement => (
  <button
    type={type}
    className={`ctb-modal-action ${variant} ${className}`.trim()}
    style={style}
    {...rest}
  >
    {icon && <span className="ctb-modal-action-icon">{icon}</span>}
    <span className="ctb-modal-action-text">{children}</span>
  </button>
);
