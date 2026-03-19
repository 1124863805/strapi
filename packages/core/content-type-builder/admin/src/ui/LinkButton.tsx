import * as React from 'react';

interface LinkButtonProps {
  tag?: React.ElementType;
  to?: string;
  variant?: string;
  startIcon?: React.ReactNode;
  children?: React.ReactNode;
  [key: string]: any;
}

export const LinkButton = ({
  tag: Tag = 'a',
  to,
  variant = 'secondary',
  startIcon,
  children,
  ...rest
}: LinkButtonProps) => (
  <Tag
    to={to}
    href={to}
    style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--ctb-space-2)',
      padding: 'var(--ctb-space-3) var(--ctb-space-5)',
      borderRadius: 'var(--ctb-radius-sm)',
      fontSize: 14,
      fontWeight: 500,
      cursor: 'pointer',
      textDecoration: 'none',
      background: variant === 'secondary' ? 'var(--ctb-bg-elevated)' : 'transparent',
      color: 'var(--ctb-primary)',
      border: variant === 'secondary' ? '1px solid var(--ctb-border)' : 'none',
    }}
    {...rest}
  >
    {startIcon}
    {children}
  </Tag>
);
