import Color from 'color';

export function getOpacityColor(color: string, opacity: number) {
  return Color(color).alpha(opacity).toString();
}

export function getDarkerColor(color: string, darker: number) {
  return Color(color).darken(darker).toString();
}

export function getLightenColor(color: string, lighten: number) {
  return Color(color).lighten(lighten).toString();
}

export function getGradientColor(color: string, opacity: number) {
  const colorOpacity = Color(color).alpha(opacity).toString();
  return `linear-gradient(161deg, ${color} 0%, ${colorOpacity} 100%)`;
}
