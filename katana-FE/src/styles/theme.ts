const {
  themeLight,
  themeDark,
  themeColors,
  theme: twTheme
} = require('../../tailwind.config');

export const colors = themeColors;

export type ColorType = keyof typeof colors;

type addPrefixToObject<
  TObject extends object,
  TPrefix extends string
  // @ts-ignore
> = `${TPrefix}${keyof TObject}`;

export type GenerateFontColor = addPrefixToObject<typeof colors, 'text-'>;
export type GenerateBgColor = addPrefixToObject<typeof colors, 'bg-'>;
export type GenerateBorderColor = addPrefixToObject<typeof colors, 'border-'>;

export const fonts = {
  ropa: 'ropa, sans-serif',
  go3v2: 'go3v2, sans-serif'
};

const zIndex = {
  min: -1,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  max: 10,
  nav: 20,
  modal: 30
};

export const LightTheme = {
  colors: themeLight,
  zIndex,
  fonts
};

export const DarkTheme = {
  ...LightTheme,
  colors: themeDark
};

export const mediaQueries = {
  mobile: '@media (min-width: 768px)',
  tablet: '@media (min-width: 992px)',
  desktop: '@media (min-width: 1200px)'
};
