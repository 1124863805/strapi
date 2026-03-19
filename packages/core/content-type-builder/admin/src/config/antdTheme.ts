/**
 * antd 主题配置 - 与 CTB 设计系统统一
 * 通过 ConfigProvider theme 注入，无需修改组件代码
 * 颜色与 ui/styles.css 中 --ctb-* 变量保持一致
 */
import type { ThemeConfig } from 'antd';

/** CTB 设计系统颜色 (与 styles.css --ctb-* 一致) */
const CTB_COLORS = {
  primary: '#0d9488',
  primaryHover: '#0b8277',
  primaryActive: '#0a7066',
  primaryBg: 'rgba(13, 148, 136, 0.1)',
  success: '#328048',
  successBg: '#eafbe7',
  warning: '#d9822f',
  warningBg: '#fdf4dc',
  error: '#d02b20',
  errorBg: '#fcecea',
  neutral0: '#ffffff',
  neutral100: '#f8fafc',
  neutral150: '#f1f5f9',
  neutral200: '#e2e8f0',
  neutral800: '#0f172a',
  neutral600: '#475569',
  neutral500: '#64748b',
} as const;

/** antd 全局 token 配置 */
const antdToken: ThemeConfig['token'] = {
  colorPrimary: CTB_COLORS.primary,
  colorPrimaryHover: CTB_COLORS.primaryHover,
  colorPrimaryActive: CTB_COLORS.primaryActive,
  colorSuccess: CTB_COLORS.success,
  colorWarning: CTB_COLORS.warning,
  colorError: CTB_COLORS.error,
  colorInfo: CTB_COLORS.primary,
  colorBgContainer: CTB_COLORS.neutral0,
  colorBgLayout: CTB_COLORS.neutral100,
  colorBgElevated: CTB_COLORS.neutral0,
  colorBorder: CTB_COLORS.neutral200,
  colorBorderSecondary: CTB_COLORS.neutral150,
  colorText: CTB_COLORS.neutral800,
  colorTextSecondary: CTB_COLORS.neutral600,
  colorTextTertiary: CTB_COLORS.neutral500,
  borderRadius: 8,
  borderRadiusLG: 12,
  borderRadiusSM: 8,
  borderRadiusXS: 4,
};

/** antd 组件级 token 覆盖 */
const antdComponents: ThemeConfig['components'] = {
  Button: {
    primaryShadow: 'none',
    defaultShadow: 'none',
    contentFontSize: 14,
    contentFontSizeLG: 14,
    contentFontSizeSM: 14,
  },
  Input: {
    borderRadius: 8,
    colorBgContainer: CTB_COLORS.neutral100,
    colorBorder: CTB_COLORS.neutral200,
    activeBorderColor: CTB_COLORS.primary,
    hoverBorderColor: CTB_COLORS.primary,
  },
  Select: {
    colorBgContainer: CTB_COLORS.neutral100,
    colorBorder: CTB_COLORS.neutral200,
  },
  Table: {
    colorBgContainer: CTB_COLORS.neutral0,
    colorBorderSecondary: CTB_COLORS.neutral150,
  },
  Modal: {
    contentBg: CTB_COLORS.neutral0,
    headerBg: CTB_COLORS.neutral0,
    titleColor: CTB_COLORS.neutral800,
  },
  Menu: {
    itemBg: 'transparent',
    itemSelectedBg: CTB_COLORS.primaryBg,
    itemSelectedColor: CTB_COLORS.primary,
    itemHoverBg: CTB_COLORS.neutral100,
    itemHoverColor: CTB_COLORS.neutral800,
  },
  Tabs: {
    itemSelectedColor: CTB_COLORS.primary,
    itemHoverColor: CTB_COLORS.primary,
    inkBarColor: CTB_COLORS.primary,
  },
};

/** 导出的 antd 主题配置 */
export const antdThemeConfig: ThemeConfig = {
  token: antdToken,
  components: antdComponents,
};
