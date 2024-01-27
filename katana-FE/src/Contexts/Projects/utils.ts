import { FilterKeyEnum, FilterType } from './types';

const resolveSearch = (search: string) => {
  return {
    $or: [
      {
        name: {
          $containsi: search
        }
      },
      {
        description: {
          $containsi: search
        }
      }
    ]
  };
};

export function resolveParams(params: FilterType) {
  const filter = Object.entries(params).reduce((acc, [key, value]) => {
    if (value) {
      if (key === FilterKeyEnum.SEARCH) {
        (acc as any) = {
          ...acc,
          ...resolveSearch(value as string)
        };
      } else {
        (acc as any)[key] = value;
      }
    }
    return acc;
  }, {});
  return filter;
}

export function resolveSort(
  sort: { key: string; direction: 'ascend' | 'descend' }[]
) {
  return sort.reduce<string[]>((acc, { key, direction }) => {
    acc.push(`${key}:${direction === 'ascend' ? 'asc' : 'desc'}`);
    return acc;
  }, []);
}
