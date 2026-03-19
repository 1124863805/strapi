import * as React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  startIcon?: React.ReactNode;
  isExternal?: boolean;
  children?: React.ReactNode;
}

export const Link = ({
  startIcon,
  isExternal,
  href,
  onClick,
  children,
  style,
  ...rest
}: LinkProps) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href === '#back' && onClick) {
      e.preventDefault();
      onClick(e as any);
    } else if (onClick) {
      onClick(e as any);
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 'var(--ctb-space-2)',
        color: 'var(--ctb-primary)',
        textDecoration: 'none',
        fontSize: 14,
        cursor: 'pointer',
        fontFamily: 'var(--ctb-font)',
        ...style,
      }}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...rest}
    >
      {startIcon}
      {children}
    </a>
  );
};
