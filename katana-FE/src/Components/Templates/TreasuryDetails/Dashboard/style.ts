import { createGlobalStyle } from 'styled-components';

export const StyleDashboard = createGlobalStyle<{
  $principalColor?: string;
  $secondaryColor?: string;
}>`
  :root, html.dark {
    ${({ $principalColor }) =>
      $principalColor && `--colors-nav: ${$principalColor};`}

    ${({ $secondaryColor }) =>
      $secondaryColor && `--colors-aside: ${$secondaryColor}`}
  }
`;
