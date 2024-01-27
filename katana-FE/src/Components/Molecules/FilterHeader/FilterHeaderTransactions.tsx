import { useState } from 'react';
import classNames from 'classnames';

import SearchInput from '@/Components/Atoms/SearchInput';
import { FilterKeyEnum } from '@/Contexts/Transactions/types';
import FilterDrawer, {
  SettingsProps
} from '@/Components/Organisms/FilterDrawer';
import { useTransactions } from '@/Contexts/Transactions';

type FilterHeaderProps = BaseComponent & {
  settingsFilter: SettingsProps[];
};

const FilterHeaderTransactions = ({
  className,
  settingsFilter,
  ...rest
}: FilterHeaderProps) => {
  const { loading, onSetFilter, filters } = useTransactions();

  const [searchText, setSearchText] = useState<string>('');
  const onApplyFilter = (values: object) => {
    onSetFilter({ ...values, [FilterKeyEnum.SEARCH]: searchText });
  };

  return (
    <div
      className={classNames([
        'flex flex-col items-end gap-3 mt-8 mb-8',
        'md:flex-row md:justify-end md:items-center',
        className
      ])}
      {...rest}
    >
      <SearchInput
        allowClear
        loading={loading}
        className="w-full md:w-96 max-w-full"
        onSearch={(value) => {
          setSearchText(value);
          return onSetFilter({
            ...filters,
            [FilterKeyEnum.SEARCH]: !value ? undefined : value
          });
        }}
        placeholder="Search name..."
      />
      <FilterDrawer settings={settingsFilter} onApplyFilter={onApplyFilter} />
    </div>
  );
};

export default FilterHeaderTransactions;
