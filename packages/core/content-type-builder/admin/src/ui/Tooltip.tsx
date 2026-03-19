import * as React from 'react';

interface TooltipProps {
  label?: string;
  children?: React.ReactNode;
}

export const Tooltip = ({ label, children }: TooltipProps) => (
  <span title={label}>{children}</span>
);
