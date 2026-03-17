import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

import { useSidebar } from './SidebarContext';
import { ChevronLeftIcon, ChevronRightIcon } from './SidebarIcons';
import { sidebarTheme } from './sidebarTheme';

const Header = styled.div<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${(p) => (p.$collapsed ? 'center' : 'space-between')};
  gap: ${sidebarTheme.spacing.md}px;
  padding: ${sidebarTheme.spacing.lg}px;
  min-height: 56px;
  overflow: hidden;
`;

const BrandText = styled.span<{ $visible: boolean }>`
  font-family: "Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 18px;
  font-weight: 600;
  color: ${sidebarTheme.colors.text};
  white-space: nowrap;
  overflow: hidden;
  flex: ${(p) => (p.$visible ? '1' : '0')};
  min-width: 0;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  transition: opacity ${sidebarTheme.transition};
`;

const ToggleBtn = styled.button<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: ${sidebarTheme.spacing.sm}px;
  border: none;
  background: transparent;
  color: ${sidebarTheme.colors.textMuted};
  cursor: pointer;
  border-radius: ${sidebarTheme.radius}px;
  flex-shrink: 0;
  transition: background ${sidebarTheme.transition}, color ${sidebarTheme.transition};

  &:hover {
    background: ${sidebarTheme.colors.bgHover};
    color: ${sidebarTheme.colors.text};
  }
`;

export const NavBrand = () => {
  const { formatMessage } = useIntl();
  const { collapsed, toggle } = useSidebar();
  const title = formatMessage({
    id: 'app.components.LeftMenu.navbrand.title',
    defaultMessage: 'Leao 控制面板',
  });
  const toggleLabel = collapsed
    ? formatMessage({ id: 'app.components.LeftMenu.expand', defaultMessage: '展开导航栏' })
    : formatMessage({ id: 'app.components.LeftMenu.collapse', defaultMessage: '折叠导航栏' });

  return (
    <Header $collapsed={collapsed} title={collapsed ? title : undefined}>
      <BrandText $visible={!collapsed}>{collapsed ? 'L' : title}</BrandText>
      <ToggleBtn
        $collapsed={collapsed}
        onClick={toggle}
        aria-label={toggleLabel}
        title={toggleLabel}
      >
        {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
      </ToggleBtn>
    </Header>
  );
};
