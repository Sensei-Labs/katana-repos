import 'styled-components';
import { themeColorsTail } from 'styles/theme';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: typeof themeColorsTail;
  }
}
