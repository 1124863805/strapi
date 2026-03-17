import * as React from 'react';
import { styled } from 'styled-components';

import { sidebarTheme } from './sidebarTheme';
import { SidebarProvider, useSidebar } from './SidebarContext';

const Nav = styled.nav<{ $collapsed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  width: ${(p) => (p.$collapsed ? sidebarTheme.width.collapsed : sidebarTheme.width.expanded)}px;
  min-width: ${(p) => (p.$collapsed ? sidebarTheme.width.collapsed : sidebarTheme.width.expanded)}px;
  height: 100vh;
  position: sticky;
  top: 0;
  z-index: 2;
  background: ${sidebarTheme.colors.bg};
  border-right: 1px solid ${sidebarTheme.colors.border};
  transition: width ${sidebarTheme.transition}, min-width ${sidebarTheme.transition};
`;

const MainNavInner = ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => {
  const { collapsed } = useSidebar();
  return (
    <Nav $collapsed={collapsed} {...props} as="nav">
      {children}
    </Nav>
  );
};

const MainNav = (props: React.HTMLAttributes<HTMLElement>) => (
  <SidebarProvider>
    <MainNavInner {...props} />
  </SidebarProvider>
);

export { MainNav };
