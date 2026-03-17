/**
 * Auth 设计系统 - 独立于 Strapi 的全新视觉语言
 * 设计理念：地平线 Horizon - 简洁、克制、专业
 */

export const authTheme = {
  colors: {
    // 主色 - 统一用于登录/注册按钮、链接、焦点
    primary: '#059669',
    primaryHover: '#047857',
    primaryMuted: 'rgba(5, 150, 105, 0.12)',

    // 中性色
    text: '#1c1917',
    textMuted: '#78716c',
    textInverse: '#fafaf9',

    // 背景
    bgBase: '#fafaf9',
    bgCard: '#ffffff',
    bgInput: '#fafaf9',

    // 边框
    border: '#e7e5e4',
    borderFocus: '#059669',

    // 状态
    error: '#dc2626',
    errorBg: '#fef2f2',
    success: '#16a34a',
  },

  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    title: {
      fontSize: '28px',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.2,
    },
    subtitle: {
      fontSize: '15px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    label: {
      fontSize: '13px',
      fontWeight: 500,
      letterSpacing: '0.01em',
    },
    input: {
      fontSize: '15px',
      fontWeight: 400,
    },
    hint: {
      fontSize: '12px',
      fontWeight: 400,
    },
    button: {
      fontSize: '15px',
      fontWeight: 500,
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  radius: {
    sm: 6,
    md: 10,
    lg: 16,
    xl: 24,
    full: 9999,
  },

  shadow: {
    card: '0 4px 6px -1px rgba(0, 0, 0, 0.04), 0 10px 20px -5px rgba(0, 0, 0, 0.06)',
    cardHover: '0 25px 50px -12px rgba(0, 0, 0, 0.1)',
    focus: '0 0 0 3px rgba(5, 150, 105, 0.25)',
  },

  transition: {
    fast: '150ms ease',
    normal: '200ms ease',
  },
} as const;
