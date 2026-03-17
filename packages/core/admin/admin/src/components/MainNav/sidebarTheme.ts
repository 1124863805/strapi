/**
 * Sidebar 设计系统 - 与 Auth 风格一致
 */
export const sidebarTheme = {
  colors: {
    primary: '#059669',
    primaryHover: '#047857',
    text: '#1c1917',
    textMuted: '#78716c',
    bg: '#ffffff',
    bgHover: '#f5f5f4',
    border: '#e7e5e4',
    danger: '#dc2626',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
  },
  width: {
    expanded: 240,
    collapsed: 72,
  },
  radius: 8,
  transition: '150ms ease',
} as const;
