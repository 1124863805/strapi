import * as React from 'react';

interface BreadcrumbsProps {
  label?: string;
  children: React.ReactNode;
}

export const Breadcrumbs = ({ children }: BreadcrumbsProps) => (
  <nav
    aria-label="Breadcrumb"
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: 'var(--ctb-space-2)',
      flexWrap: 'wrap',
      fontFamily: 'var(--ctb-font)',
    }}
  >
    {React.Children.map(children, (child, i) => (
      <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--ctb-space-2)' }}>
        {i > 0 && <span style={{ color: 'var(--ctb-text-muted)' }}>/</span>}
        {child}
      </span>
    ))}
  </nav>
);

interface CrumbProps {
  isCurrent?: boolean;
  children: React.ReactNode;
}

export const Crumb = ({ isCurrent, children }: CrumbProps) => (
  <span
    aria-current={isCurrent ? 'page' : undefined}
    style={{
      fontSize: 14,
      color: isCurrent ? 'var(--ctb-text)' : 'var(--ctb-primary)',
      fontWeight: isCurrent ? 600 : 400,
    }}
  >
    {children}
  </span>
);
