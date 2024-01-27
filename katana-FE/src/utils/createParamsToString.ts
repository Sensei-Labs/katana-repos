function isObject(value: any) {
  return value !== null && typeof value === 'object';
}

function buildNestedParam(key: string, value: any): string {
  if (Array.isArray(value)) {
    return value
      .map((item, index) => buildNestedParam(`${key}[${index}]`, item))
      .join('&');
  } else if (isObject(value)) {
    return createParamsToString(value, key);
  } else {
    return encodeURIComponent(key) + '=' + encodeURIComponent(value);
  }
}

export default function createParamsToString(
  params: Record<string, any>,
  prefix: string
): string {
  return Object.keys(params)
    .map((key) => {
      const fullKey = prefix ? `${prefix}[${key}]` : key;
      return buildNestedParam(fullKey, params[key]);
    })
    .join('&');
}
