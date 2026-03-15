import 'styled-components';
import { LeaoTheme } from './src/index';

declare module 'styled-components' {
  export interface DefaultTheme extends LeaoTheme {}
}
