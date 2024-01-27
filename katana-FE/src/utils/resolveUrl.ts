export default function resolveUrl(
  path: string,
  param: string,
  replace?: string | number
) {
  return path.replace(param, String(replace || ''));
}

export function resolveTwitterUrl(username?: string) {
  if (!username) return '';
  return `https://twitter.com/${username.replace('@', '')}`;
}
