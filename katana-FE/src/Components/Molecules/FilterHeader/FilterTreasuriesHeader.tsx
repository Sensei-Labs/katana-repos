import { useMemo } from 'react';
import classNames from 'classnames';
import SearchInput from '@/Components/Atoms/SearchInput';
import FilterDrawer, {
  FilterDrawerProps
} from '@/Components/Organisms/FilterDrawer';
import { useTreasuryList } from '@/Contexts/Projects';
import useInmutableSWR from 'swr/immutable';
import { API_ROUTES } from '@/config/api';
import { fetcher } from '@/services/api';
import { FilterKeyEnum, FilterType } from '@/Contexts/Projects/types';

type FilterHeaderProps = BaseComponent;

const FilterTreasuriesHeader = ({ className, ...props }: FilterHeaderProps) => {
  const { setFilters, filters } = useTreasuryList();

  const { data } = useInmutableSWR<
    ResponseServer<{ name: string; id: number }[]>
  >(API_ROUTES.GET_TREASURY_TAGS.path, fetcher);

  const tags = useMemo(() => {
    if (!data?.data?.length) return [];
    return data.data.map((item) => ({
      id: item.id,
      label: item.name,
      value: item.id
    }));
  }, [data]);

  const filterSettings = useMemo<FilterDrawerProps<any>['settings']>(() => {
    return [
      {
        type: 'select',
        field: 'tags',
        label: 'Categories',
        mode: 'multiple',
        options: tags
      }
    ];
  }, [tags]);

  const onApplyFilters = (params: Pick<FilterType, FilterKeyEnum.TAGS>) => {
    setFilters(params);
  };

  return (
    <>
      <div
        className={classNames(
          'flex gap-2 my-10 justify-between items-center',
          className
        )}
        {...props}
      >
        <SearchInput
          allowClear
          placeholder="Search name..."
          defaultValue={(filters?.[FilterKeyEnum.SEARCH] as string) || ''}
          key={(filters?.[FilterKeyEnum.SEARCH] as string)?.trim() || 'key-1'}
          onSearch={(value) => setFilters({ [FilterKeyEnum.SEARCH]: value })}
        />

        <FilterDrawer
          settings={filterSettings}
          onApplyFilter={onApplyFilters}
        />
      </div>
    </>
  );
};

export default FilterTreasuriesHeader;
