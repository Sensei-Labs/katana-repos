import { Children, isValidElement, ReactElement, ReactNode } from 'react';

export const toCurrency = (value: number) =>
  Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);

const hasChildren = (
  element: ReactNode
): element is ReactElement<{ children: ReactNode | ReactNode[] }> => {
  return (
    isValidElement<{ children?: ReactNode[] }>(element) &&
    Boolean(element.props.children)
  );
};

export const childToString = (child?: ReactNode): string => {
  if (
    typeof child === 'undefined' ||
    child === null ||
    typeof child === 'boolean'
  ) {
    return '';
  }

  if (JSON.stringify(child) === '{}') {
    return '';
  }

  return (child as number | string).toString();
};

export const reactChildrenText = (
  children: ReactNode | ReactNode[]
): string => {
  if (!(children instanceof Array) && !isValidElement(children)) {
    return childToString(children);
  }

  return Children.toArray(children).reduce(
    (text: string, child: ReactNode): string => {
      let newText: string;

      if (isValidElement(child) && hasChildren(child)) {
        newText = reactChildrenText(child.props.children);
      } else if (isValidElement(child) && !hasChildren(child)) {
        newText = '';
      } else {
        newText = childToString(child);
      }

      return text.concat(newText);
    },
    ''
  );
};

export const setDimension = (value: string | number) => {
  return typeof value === 'number' ? `${value}px` : value;
};

export const getWalletProvider = () => {
  if ('phantom' in window) {
    const provider = (window as any).phantom?.solana;

    if (provider?.isPhantom) {
      return provider;
    }
  }
};

export async function asyncForMap<P = any, O = any>(
  arr: P[],
  cb: (item: P, index: number) => Promise<O>
) {
  const output: O[] = [];

  for (let index = 0; index < arr.length; index++) {
    const item = arr[index];
    const result = await cb(item, index);
    output.push(result);
  }

  return output;
}

export function forMap<P = any, O = any>(
  arr: P[],
  cb: (item: P, index: number) => O
) {
  const output: O[] = [];

  for (let index = 0; index < arr.length; index++) {
    const item = arr[index];
    const result = cb(item, index);
    output.push(result);
  }

  return output;
}

export const validateArray = (value?: any) => {
  return Array.isArray(value) ? value : [];
};
