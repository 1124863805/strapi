import { useState } from 'react';
import { Layout, Menu, Tabs } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import upperFirst from 'lodash/upperFirst';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router-dom';

import { getTrad } from '../../utils/getTrad';

import { useContentTypeBuilderMenu } from './useContentTypeBuilderMenu';

const { Sider } = Layout;

type TabKey = 'all' | 'models' | 'singleTypes' | 'components';

export const ContentTypeBuilderNav = () => {
  const { menu } = useContentTypeBuilderMenu();
  const { formatMessage } = useIntl();
  const location = useLocation();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<TabKey>('all');

  const pluginName = formatMessage({
    id: getTrad('plugin.name'),
    defaultMessage: 'Content-Type Builder',
  });

  const filteredMenu =
    activeTab === 'all'
      ? menu
      : menu.filter((s) => s.name === activeTab);

  const buildMenuItems = () => {
    return filteredMenu.map((section) => {
      const sectionLabel = formatMessage(section.title);
      const hasNested = section.links.some((l: any) => Array.isArray(l.links));

      if (hasNested) {
        const children = section.links.flatMap((link: any) =>
          (link.links || []).map((sub: any) => ({
            key: sub.to,
            label: upperFirst(formatMessage({ id: sub.name, defaultMessage: sub.title })),
          }))
        );
        return {
          key: `group-${section.name}`,
          label: sectionLabel,
          type: 'group' as const,
          children: children.length
            ? children.map((c) => ({
                key: c.key,
                label: c.label,
              }))
            : undefined,
        };
      }

      const items = section.links.map((link: any) => ({
        key: link.to,
        label: upperFirst(formatMessage({ id: link.name, defaultMessage: link.title })),
      }));
      return {
        key: `group-${section.name}`,
        label: sectionLabel,
        type: 'group' as const,
        children: items,
      };
    });
  };

  const tabItems = [
    { key: 'all', label: formatMessage({ id: getTrad('menu.section.all'), defaultMessage: '全部' }) },
    { key: 'models', label: formatMessage({ id: getTrad('menu.section.models.name'), defaultMessage: '集合' }) },
    { key: 'singleTypes', label: formatMessage({ id: getTrad('menu.section.single-types.name'), defaultMessage: '单一' }) },
    { key: 'components', label: formatMessage({ id: getTrad('menu.section.components.name'), defaultMessage: '组件' }) },
  ];

  return (
    <Sider
      width={260}
      style={{
        height: '100vh',
        background: 'var(--ctb-bg-elevated)',
        borderRight: '1px solid var(--ctb-border-subtle)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ padding: 'var(--ctb-space-4) var(--ctb-space-4) var(--ctb-space-2)', flexShrink: 0 }}>
        <span style={{ fontSize: 16, fontWeight: 600, color: 'var(--ctb-text)' }}>{pluginName}</span>
      </div>
      <Tabs
        activeKey={activeTab}
        onChange={(k) => setActiveTab(k as TabKey)}
        size="small"
        items={tabItems}
        style={{ padding: '0 var(--ctb-space-3) var(--ctb-space-2)', flexShrink: 0 }}
      />
      <div style={{ flex: 1, minHeight: 0, overflow: 'auto' }}>
        <Menu
          mode="inline"
          defaultOpenKeys={['group-models', 'group-singleTypes', 'group-components']}
          selectedKeys={[location.pathname]}
          style={{ border: 'none', paddingLeft: 'var(--ctb-space-2)' }}
          items={buildMenuItems()}
          onClick={({ key }) => navigate(key)}
        />
        {filteredMenu.map((section) => {
          const link = section.customLink;
          if (!link || typeof link !== 'object' || !('onClick' in link)) return null;
          return (
            <div key={section.name} style={{ padding: 'var(--ctb-space-2) var(--ctb-space-4) var(--ctb-space-3)', borderTop: '1px solid var(--ctb-border-subtle)' }}>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  link.onClick();
                }}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 'var(--ctb-space-2)',
                  color: 'var(--ctb-primary)',
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                <PlusOutlined />
                {formatMessage(link)}
              </a>
            </div>
          );
        })}
      </div>
    </Sider>
  );
};
