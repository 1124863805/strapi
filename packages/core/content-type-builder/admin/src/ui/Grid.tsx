import * as React from 'react';

interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  gap?: number;
  children?: React.ReactNode;
}

const GridBase = ({ gap = 4, style, children, ...rest }: GridProps) => (
  <div
    style={{
      display: 'grid',
      gap: `calc(var(--ctb-space-1) * ${gap})`,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

interface GridRootProps extends GridProps {
  gap?: number;
}

interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
  col?: number;
  direction?: string;
  alignItems?: string;
  children?: React.ReactNode;
}

const GridRoot = ({ gap = 4, children, ...rest }: GridRootProps) => (
  <div style={{ display: 'grid', gap: `calc(var(--ctb-space-1) * ${gap})`, gridTemplateColumns: 'repeat(12, 1fr)' }} {...rest}>
    {children}
  </div>
);

const GridItem = ({ col = 12, direction, alignItems, style, children, ...rest }: GridItemProps) => (
  <div
    style={{
      gridColumn: `span ${col}`,
      display: 'flex',
      flexDirection: direction as any,
      alignItems,
      ...style,
    }}
    {...rest}
  >
    {children}
  </div>
);

export const Grid = Object.assign(GridBase, { Root: GridRoot, Item: GridItem });
