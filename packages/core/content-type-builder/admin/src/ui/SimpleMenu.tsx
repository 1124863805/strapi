import * as React from 'react';
import { NavLink } from 'react-router-dom';
import { styled } from 'styled-components';

const SubNavWrapper = styled.nav`
  width: 260px;
  min-height: 100vh;
  background: var(--ctb-bg-elevated);
  border-right: 1px solid var(--ctb-border);
  font-family: var(--ctb-font);
  overflow-y: auto;
`;

export const SubNav = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
  <SubNavWrapper {...props}>{children}</SubNavWrapper>
);

interface SubNavHeaderProps {
  label: string;
  searchable?: boolean;
  value?: string;
  onChange?: (e: { target: { value: string } }) => void;
  onClear?: () => void;
  searchLabel?: string;
}

export const SubNavHeader = ({
  label,
  searchable,
  value = '',
  onChange,
  searchLabel,
}: SubNavHeaderProps) => {
  const [showSearch, setShowSearch] = React.useState(false);

  if (showSearch && searchable) {
    return (
      <div style={{ padding: 'var(--ctb-space-5) var(--ctb-space-4)' }}>
        <input
          type="search"
          value={value}
          onChange={(e) => onChange?.({ target: { value: e.target.value } })}
          onBlur={() => !value && setShowSearch(false)}
          onKeyDown={(e) => e.key === 'Escape' && setShowSearch(false)}
          placeholder={searchLabel}
          autoFocus
          style={{
            width: '100%',
            padding: 'var(--ctb-space-3) var(--ctb-space-4)',
            border: '1px solid var(--ctb-border)',
            borderRadius: 'var(--ctb-radius)',
            fontSize: 14,
            fontFamily: 'var(--ctb-font)',
            outline: 'none',
          }}
        />
        <div style={{ height: 1, background: 'var(--ctb-border)', marginTop: 'var(--ctb-space-4)' }} />
      </div>
    );
  }

  return (
    <div style={{ padding: 'var(--ctb-space-6) var(--ctb-space-6) var(--ctb-space-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0, fontSize: 16, fontWeight: 600, color: 'var(--ctb-text)' }}>{label}</h2>
        {searchable && (
          <button
            type="button"
            onClick={() => setShowSearch(true)}
            aria-label={searchLabel}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 'var(--ctb-space-2)',
              color: 'var(--ctb-text-muted)',
              borderRadius: 'var(--ctb-radius-sm)',
            }}
          >
            <SearchIcon />
          </button>
        )}
      </div>
      <div style={{ height: 1, background: 'var(--ctb-border)', marginTop: 'var(--ctb-space-4)' }} />
    </div>
  );
};

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
  </svg>
);

export const SubNavSections = ({ children }: { children: React.ReactNode }) => (
  <ol style={{ listStyle: 'none', margin: 0, padding: 'var(--ctb-space-2) 0 var(--ctb-space-8)' }}>{children}</ol>
);

interface SubNavSectionProps {
  label: string;
  collapsable?: boolean;
  badgeLabel?: string;
  children: React.ReactNode;
}

export const SubNavSection = ({
  label,
  collapsable = false,
  badgeLabel,
  children,
}: SubNavSectionProps) => {
  const [open, setOpen] = React.useState(true);
  return (
    <li style={{ marginBottom: 'var(--ctb-space-2)' }}>
      <div
        style={{
          padding: 'var(--ctb-space-2) var(--ctb-space-6) var(--ctb-space-2) var(--ctb-space-5)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <button
          type="button"
          onClick={() => collapsable && setOpen((o) => !o)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            fontSize: 11,
            fontWeight: 600,
            color: 'var(--ctb-text-muted)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          {label}
        </button>
        {badgeLabel && (
          <span
            style={{
              background: 'var(--ctb-bg-hover)',
              color: 'var(--ctb-text-muted)',
              padding: 'var(--ctb-space-1) var(--ctb-space-2)',
              borderRadius: 'var(--ctb-radius-sm)',
              fontSize: 11,
              fontWeight: 500,
            }}
          >
            {badgeLabel}
          </span>
        )}
      </div>
      {(!collapsable || open) && <ol style={{ listStyle: 'none', margin: 0, padding: 0 }}>{children}</ol>}
    </li>
  );
};

interface SubNavLinkSectionProps {
  label: string;
  children: React.ReactNode;
}

export const SubNavLinkSection = ({ label, children }: SubNavLinkSectionProps) => {
  const [open, setOpen] = React.useState(true);
  return (
    <div>
      <div style={{ padding: 'var(--ctb-space-1) var(--ctb-space-6)' }}>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--ctb-space-2)',
            fontSize: 14,
            fontWeight: 500,
            color: 'var(--ctb-text)',
          }}
        >
          <span
            style={{
              transform: open ? 'rotate(0deg)' : 'rotate(-90deg)',
              display: 'inline-block',
              transition: 'transform 180ms ease',
              fontSize: 10,
            }}
          >
            ▼
          </span>
          {label}
        </button>
      </div>
      {open && <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>{children}</ul>}
    </div>
  );
};

const LinkStyled = styled(NavLink)`
  display: flex;
  align-items: center;
  padding: var(--ctb-space-3) var(--ctb-space-6) var(--ctb-space-3) var(--ctb-space-8);
  text-decoration: none;
  color: var(--ctb-text);
  font-size: 14px;
  transition: all 180ms ease;
  border-left: 3px solid transparent;
  margin-left: 0;

  &.active {
    background: var(--ctb-primary-soft);
    border-left-color: var(--ctb-primary);
    color: var(--ctb-primary);
    font-weight: 500;
  }

  &:hover:not(.active) {
    background: var(--ctb-bg-hover);
  }
`;

interface SubNavLinkProps {
  to: string;
  children: React.ReactNode;
  active?: boolean;
  isSubSectionChild?: boolean;
  tag?: React.ElementType;
  width?: string;
}

export const SubNavLink = ({
  to,
  children,
  tag: Tag = LinkStyled,
  width,
  ...rest
}: SubNavLinkProps) => {
  if (Tag === NavLink) {
    return (
      <li>
        <LinkStyled to={to} style={{ width }} {...rest}>
          {children}
        </LinkStyled>
      </li>
    );
  }
  return (
    <li>
      <Tag to={to} style={{ width }} {...rest}>
        {children}
      </Tag>
    </li>
  );
};

export const TextButton = ({
  children,
  onClick,
  startIcon,
  style,
  marginTop,
  cursor,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  startIcon?: React.ReactNode;
  marginTop?: number;
  cursor?: string;
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      background: 'none',
      border: 'none',
      color: 'var(--ctb-primary)',
      cursor: cursor ?? 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 'var(--ctb-space-2)',
      padding: 0,
      fontSize: 14,
      marginTop: marginTop != null ? `calc(var(--ctb-space-1) * ${marginTop})` : undefined,
      fontFamily: 'var(--ctb-font)',
      fontWeight: 500,
      ...style,
    }}
    {...rest}
  >
    {startIcon}
    {children}
  </button>
);
