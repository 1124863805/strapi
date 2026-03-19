import * as React from 'react';

interface KeyboardNavigableProps extends React.HTMLAttributes<HTMLDivElement> {
  tagName?: string;
  attributeName?: string;
  children?: React.ReactNode;
}

export const KeyboardNavigable = ({ children, ...props }: KeyboardNavigableProps) => (
  <div {...props}>{children}</div>
);
