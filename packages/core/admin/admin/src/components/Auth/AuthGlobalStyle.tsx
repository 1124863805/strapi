import { createGlobalStyle } from 'styled-components';

import { authTheme } from './theme';

/**
 * Auth 页面全局样式 - 背景与字体
 * 字体通过 UnauthenticatedLayout 的 link 标签加载
 */
export const AuthGlobalStyle = createGlobalStyle`
  [data-auth-page] {
    font-family: ${authTheme.typography.fontFamily};
    min-height: 100vh;
    background: linear-gradient(160deg, ${authTheme.colors.bgBase} 0%, #f5f5f4 40%, #e7e5e4 100%);
    background-attachment: fixed;
  }
`;
