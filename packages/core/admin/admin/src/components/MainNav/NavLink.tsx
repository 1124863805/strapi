import * as React from 'react';
import { NavLink as RouterLink, LinkProps } from 'react-router-dom';
import { styled } from 'styled-components';

import { useSidebar } from './SidebarContext';
import { sidebarTheme } from './sidebarTheme';

const LinkWrapper = styled(RouterLink)<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${sidebarTheme.spacing.md}px;
  padding: ${sidebarTheme.spacing.md}px ${sidebarTheme.spacing.lg}px;
  text-decoration: none;
  color: ${sidebarTheme.colors.textMuted};
  border-radius: ${sidebarTheme.radius}px;
  transition: background ${sidebarTheme.transition}, color ${sidebarTheme.transition};
  min-height: 44px;
  justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
  position: relative;

  &:hover {
    background: ${sidebarTheme.colors.bgHover};
    color: ${sidebarTheme.colors.text};
  }

  &.active {
    background: rgba(5, 150, 105, 0.08);
    color: ${sidebarTheme.colors.primary};
  }

  &.active svg {
    stroke: ${sidebarTheme.colors.primary};
    fill: ${sidebarTheme.colors.primary};
  }

  svg {
    flex-shrink: 0;
    stroke: currentColor;
    fill: currentColor;
  }
`;

const LinkLabel = styled.span<{ $visible: boolean }>`
  font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  width: ${(p) => (p.$visible ? 'auto' : 0)};
  transition: opacity ${sidebarTheme.transition};
`;

const Badge = styled.span`
  position: absolute;
  top: 6px;
  right: 8px;
  min-width: 18px;
  height: 18px;
  padding: 0 5px;
  font-size: 11px;
  font-weight: 600;
  color: white;
  background: ${sidebarTheme.colors.primary};
  border-radius: 9px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

interface NavLinkProps extends Omit<LinkProps, 'to'> {
  to: string;
  end?: boolean;
  label: string;
  icon: React.ReactNode;
  badge?: React.ReactNode;
  badgeNumeric?: string;
}

const LinkImpl = ({ to, label, icon, badge, badgeNumeric, ...props }: NavLinkProps) => {
  const { collapsed } = useSidebar();
  return (
    <LinkWrapper
      to={to}
      $collapsed={collapsed}
      title={collapsed ? label : undefined}
      aria-label={label}
      {...props}
    >
      <span aria-hidden style={{ position: 'relative' }}>
        {icon}
        {badgeNumeric && collapsed && (
          <Badge style={{ top: -4, right: -6, minWidth: 16, height: 16, fontSize: 10 }}>
            {badgeNumeric}
          </Badge>
        )}
      </span>
      <LinkLabel $visible={!collapsed}>{label}</LinkLabel>
      {!collapsed && badge}
      {badgeNumeric && !collapsed && <Badge>{badgeNumeric}</Badge>}
    </LinkWrapper>
  );
};

const NavLink = {
  Link: LinkImpl,
};

export { NavLink };
