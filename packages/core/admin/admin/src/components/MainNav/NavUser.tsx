import * as React from 'react';
import { useIntl } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { styled } from 'styled-components';

import { useAuth } from '../../features/Auth';
import { useSidebar } from './SidebarContext';
import { SignOutIcon, UserIcon } from './SidebarIcons';
import { sidebarTheme } from './sidebarTheme';

const UserWrapper = styled.div<{ $collapsed: boolean }>`
  padding: ${sidebarTheme.spacing.md}px;
  border-top: 1px solid ${sidebarTheme.colors.border};
  display: flex;
  justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
  align-items: center;
`;

const Trigger = styled.button<{ $collapsed: boolean }>`
  display: flex;
  align-items: center;
  gap: ${sidebarTheme.spacing.md}px;
  padding: ${sidebarTheme.spacing.sm}px;
  width: ${(p) => (p.$collapsed ? 'auto' : '100%')};
  justify-content: ${(p) => (p.$collapsed ? 'center' : 'flex-start')};
  border: none;
  background: transparent;
  border-radius: ${sidebarTheme.radius}px;
  cursor: pointer;
  color: ${sidebarTheme.colors.textMuted};
  transition: background ${sidebarTheme.transition}, color ${sidebarTheme.transition};

  &:hover {
    background: ${sidebarTheme.colors.bgHover};
    color: ${sidebarTheme.colors.text};
  }
`;

const Avatar = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${sidebarTheme.colors.primary};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  flex-shrink: 0;
`;

const UserName = styled.span<{ $visible: boolean }>`
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  opacity: ${(p) => (p.$visible ? 1 : 0)};
  width: ${(p) => (p.$visible ? 'auto' : 0)};
`;

const Dropdown = styled.div`
  position: absolute;
  bottom: 100%;
  left: ${sidebarTheme.spacing.md}px;
  right: ${sidebarTheme.spacing.md}px;
  margin-bottom: 4px;
  background: ${sidebarTheme.colors.bg};
  border: 1px solid ${sidebarTheme.colors.border};
  border-radius: ${sidebarTheme.radius}px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.12);
  overflow: hidden;
  z-index: 10;
`;

const DropdownItem = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${sidebarTheme.spacing.md}px;
  width: 100%;
  padding: ${sidebarTheme.spacing.md}px ${sidebarTheme.spacing.lg}px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: ${(p) => (p.$danger ? sidebarTheme.colors.danger : sidebarTheme.colors.text)};
  text-align: left;
  transition: background ${sidebarTheme.transition};

  &:hover {
    background: ${sidebarTheme.colors.bgHover};
  }
`;

const UserContainer = styled.div`
  position: relative;
`;

export interface NavUserProps {
  initials: string;
  children?: React.ReactNode;
}

export const NavUser = ({ children, initials }: NavUserProps) => {
  const { formatMessage } = useIntl();
  const navigate = useNavigate();
  const { collapsed } = useSidebar();
  const logout = useAuth('Logout', (state) => state.logout);
  const [open, setOpen] = React.useState(false);
  const ref = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [open]);

  const handleProfile = () => {
    setOpen(false);
    navigate('/me');
  };
  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/auth/login');
  };

  return (
    <UserContainer ref={ref}>
      <UserWrapper $collapsed={collapsed}>
        <Trigger
          $collapsed={collapsed}
          onClick={() => setOpen((o) => !o)}
          aria-haspopup="true"
          aria-expanded={open}
          aria-label={String(children)}
        >
          <Avatar>{initials}</Avatar>
          <UserName $visible={!collapsed}>{children}</UserName>
        </Trigger>
      </UserWrapper>
      {open && (
        <Dropdown>
          <DropdownItem onClick={handleProfile}>
            <UserIcon style={{ flexShrink: 0 }} />
            {formatMessage({ id: 'global.profile', defaultMessage: '个人资料' })}
          </DropdownItem>
          <DropdownItem $danger onClick={handleLogout}>
            <SignOutIcon style={{ flexShrink: 0 }} />
            {formatMessage({ id: 'app.components.LeftMenu.logout', defaultMessage: '登出' })}
          </DropdownItem>
        </Dropdown>
      )}
    </UserContainer>
  );
};
