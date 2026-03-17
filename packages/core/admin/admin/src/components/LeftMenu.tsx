import * as React from 'react';

import { useIntl } from 'react-intl';
import { styled } from 'styled-components';

import { useAuth } from '../features/Auth';
import { Menu, MenuItem } from '../hooks/useMenu';
import { getDisplayName } from '../utils/users';

import { MainNav } from './MainNav/MainNav';
import { NavBrand } from './MainNav/NavBrand';
import { NavLink } from './MainNav/NavLink';
import { NavUser } from './MainNav/NavUser';
import { LockIcon } from './MainNav/SidebarIcons';
import { sidebarTheme } from './MainNav/sidebarTheme';

const NavList = styled.ul`
  list-style: none;
  margin: 0;
  padding: ${sidebarTheme.spacing.md}px ${sidebarTheme.spacing.sm}px;
  flex: 1;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavListItem = styled.li`
  margin: 0;
`;

const Divider = styled.div`
  height: 1px;
  background: ${sidebarTheme.colors.border};
  margin: 0 ${sidebarTheme.spacing.lg}px;
`;

const sortLinks = (links: MenuItem[]) => {
  return [...links].sort((a, b) => {
    const positionA = a.position ?? 6;
    const positionB = b.position ?? 6;
    return positionA - positionB;
  });
};

const LeftMenu = ({ generalSectionLinks, pluginsSectionLinks }: LeftMenuProps) => {
  const user = useAuth('AuthenticatedApp', (state) => state.user);
  const userDisplayName = getDisplayName(user);
  const { formatMessage, locale } = useIntl();

  const formatter = React.useMemo(
    () => new Intl.Collator(locale, { sensitivity: 'base' }),
    [locale]
  );

  const initials = userDisplayName
    .split(' ')
    .map((name) => name.substring(0, 1))
    .join('')
    .substring(0, 2);

  const listLinksAlphabeticallySorted = [...pluginsSectionLinks, ...generalSectionLinks].sort(
    (a, b) => formatter.compare(formatMessage(a.intlLabel), formatMessage(b.intlLabel))
  );
  const listLinks = sortLinks(listLinksAlphabeticallySorted);

  return (
    <MainNav>
      <NavBrand />
      <Divider />
      <NavList>
        {listLinks.map((link) => {
          const LinkIcon = link.icon;
          const labelValue = formatMessage(link.intlLabel);
          const badgeLock = link?.eeOnly ? <LockIcon style={{ color: '#d97706' }} /> : null;
          const badgeNumeric =
            link.notificationsCount && link.notificationsCount > 0
              ? link.notificationsCount.toString()
              : undefined;

          const toPath = link.to.startsWith('/') ? link.to : `/${link.to}`;
          return (
            <NavListItem key={link.to}>
              <NavLink.Link
                to={toPath}
                end={toPath === '/'}
                label={labelValue}
                icon={
                  <LinkIcon
                    width={20}
                    height={20}
                    style={{ stroke: 'currentColor', flexShrink: 0 }}
                  />
                }
                badge={badgeLock}
                badgeNumeric={badgeNumeric}
              />
            </NavListItem>
          );
        })}
      </NavList>
      <NavUser initials={initials}>{userDisplayName}</NavUser>
    </MainNav>
  );
};

interface LeftMenuProps extends Pick<Menu, 'generalSectionLinks' | 'pluginsSectionLinks'> {}

export { LeftMenu };
