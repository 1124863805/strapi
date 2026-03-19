import { useState, useRef, useEffect } from 'react';

import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';
import upperFirst from 'lodash/upperFirst';
import { styled } from 'styled-components';

import { Button, Flex, Plus } from '../../ui';
import { getTrad } from '../../utils/getTrad';

import { useContentTypeBuilderMenu } from '../ContentTypeBuilderNav/useContentTypeBuilderMenu';

const TopNavWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--ctb-space-4) var(--ctb-space-6);
  background: var(--ctb-bg-elevated);
  border-bottom: 1px solid var(--ctb-border);
  font-family: var(--ctb-font);
`;

const DropdownTrigger = styled.button`
  display: flex;
  align-items: center;
  gap: var(--ctb-space-2);
  padding: var(--ctb-space-3) var(--ctb-space-4);
  background: var(--ctb-bg-elevated);
  border: 1px solid var(--ctb-border);
  border-radius: var(--ctb-radius-sm);
  font-size: 14px;
  font-weight: 500;
  color: var(--ctb-text);
  cursor: pointer;
  font-family: var(--ctb-font);
  min-width: 200px;
  justify-content: space-between;

  &:hover {
    background: var(--ctb-bg-hover);
    border-color: var(--ctb-text-muted);
  }
`;

const DropdownPanel = styled.div`
  position: absolute;
  top: calc(100% + var(--ctb-space-1));
  left: 0;
  min-width: 100%;
  max-height: 320px;
  overflow-y: auto;
  background: var(--ctb-bg-elevated);
  border: 1px solid var(--ctb-border);
  border-radius: var(--ctb-radius-sm);
  box-shadow: var(--ctb-shadow-lg);
  z-index: var(--ctb-z-dropdown);
`;

const DropdownSection = styled.div`
  padding: var(--ctb-space-2) 0;
  border-bottom: 1px solid var(--ctb-border);

  &:last-child {
    border-bottom: none;
  }
`;

const DropdownSectionLabel = styled.div`
  padding: var(--ctb-space-2) var(--ctb-space-4);
  font-size: 11px;
  font-weight: 600;
  color: var(--ctb-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;

const DropdownItem = styled.button<{ $active?: boolean }>`
  display: block;
  width: 100%;
  padding: var(--ctb-space-3) var(--ctb-space-4);
  text-align: left;
  background: ${(p) => (p.$active ? 'var(--ctb-primary-soft)' : 'transparent')};
  border: none;
  font-size: 14px;
  color: ${(p) => (p.$active ? 'var(--ctb-primary)' : 'var(--ctb-text)')};
  cursor: pointer;
  font-family: var(--ctb-font);

  &:hover {
    background: var(--ctb-bg-hover);
  }
`;

const ActionsWrapper = styled(Flex)`
  gap: var(--ctb-space-2);
`;

const DropdownWrapper = styled.div`
  position: relative;
`;

type FlatItem = { to: string; title: string };

const flattenMenuItems = (menu: ReturnType<typeof useContentTypeBuilderMenu>['menu']): FlatItem[] => {
  const items: FlatItem[] = [];
  for (const section of menu) {
    const hasNested = section.links.some((l: any) => Array.isArray(l.links));
    if (hasNested) {
      for (const link of section.links) {
        const subLinks = (link as any).links || [];
        for (const sub of subLinks) {
          items.push({ to: sub.to, title: sub.title });
        }
      }
    } else {
      for (const link of section.links) {
        const ct = link as { to?: string; title?: string; name?: string };
        if (ct.to) {
          items.push({ to: ct.to, title: ct.title || ct.name || '' });
        }
      }
    }
  }
  return items;
};

export const ContentTypeBuilderTopNav = () => {
  const { menu } = useContentTypeBuilderMenu();
  const { formatMessage } = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const flatItems = flattenMenuItems(menu);
  const currentItem = flatItems.find(
    (item) => location.pathname === item.to || location.pathname.startsWith(item.to + '/')
  );
  const currentLabel = currentItem ? upperFirst(currentItem.title) : formatMessage({ id: getTrad('menu.selectContentType'), defaultMessage: '选择内容类型' });

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (to: string) => {
    navigate(to);
    setOpen(false);
  };

  return (
    <TopNavWrapper>
      <DropdownWrapper ref={wrapperRef}>
        <DropdownTrigger type="button" onClick={() => setOpen(!open)}>
          <span>{currentLabel}</span>
          <ChevronDownIcon />
        </DropdownTrigger>
        {open && (
          <DropdownPanel>
            {menu.map((section) => {
              const sectionLabel = formatMessage(section.title);
              const hasNested = section.links.some((l: any) => Array.isArray(l.links));
              return (
                <DropdownSection key={section.name}>
                  <DropdownSectionLabel>{sectionLabel}</DropdownSectionLabel>
                  {hasNested
                    ? section.links.flatMap((link: any) =>
                        (link.links || []).map((sub: any) => (
                          <DropdownItem
                            key={sub.name}
                            $active={location.pathname === sub.to}
                            onClick={() => handleSelect(sub.to)}
                          >
                            {upperFirst(sub.title)}
                          </DropdownItem>
                        ))
                      )
                    : section.links.map((link: any) => (
                        <DropdownItem
                          key={link.to || link.name}
                          $active={location.pathname === link.to}
                          onClick={() => handleSelect(link.to)}
                        >
                          {upperFirst(link.title)}
                        </DropdownItem>
                      ))}
                </DropdownSection>
              );
            })}
          </DropdownPanel>
        )}
      </DropdownWrapper>
      <ActionsWrapper>
        {menu.map((section) =>
          section.customLink ? (
            <Button
              key={section.name}
              variant="secondary"
              startIcon={<Plus />}
              onClick={section.customLink.onClick}
            >
              {formatMessage(section.customLink)}
            </Button>
          ) : null
        )}
      </ActionsWrapper>
    </TopNavWrapper>
  );
};

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
    <path d="M7 10l5 5 5-5z" />
  </svg>
);
