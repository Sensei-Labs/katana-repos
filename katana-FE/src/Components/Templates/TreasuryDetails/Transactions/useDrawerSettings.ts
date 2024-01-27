import { SettingsProps } from '@/Components/Organisms/FilterDrawer';
import {
  mapOptionsAmount,
  mapOptionsAssets,
  mapOptionsDirection,
  mapOptionsPeriod
} from '@/Components/Molecules/FilterHeader/options';
import useSWR from 'swr';
import { API_ROUTES } from '@/config/api';
import { fetcher } from '@/services/api';
import { CategoryTransaction } from '@/Components/Atoms/SelectCategoryTransaction/SelectCategoryTransaction';
import { FilterKeyEnum } from '@/Contexts/Transactions/types';

export default function useDrawerSettings(): SettingsProps[] {
  const { data, isLoading } = useSWR<PaginationServer<CategoryTransaction>>(
    API_ROUTES.GET_ALL_CATEGORY_TRANSACTIONS.path,
    fetcher
  );

  return [
    {
      label: 'Direction',
      field: FilterKeyEnum.DIRECTION,
      type: 'select',
      options: mapOptionsDirection
    },
    {
      label: 'Asset',
      field: FilterKeyEnum.ASSET,
      type: 'select',
      options: mapOptionsAssets
    },
    {
      label: 'Category',
      field: FilterKeyEnum.TAGS,
      type: 'select',
      isLoading,
      options:
        data?.data?.map((item) => ({ label: item.name, value: item.id })) || []
    },
    {
      label: 'Amount',
      field: FilterKeyEnum.AMOUNT,
      type: 'select',
      options: mapOptionsAmount
    },
    {
      label: 'Date "From"',
      field: FilterKeyEnum.DATE_FROM,
      type: 'datePicker'
    },
    {
      label: 'Date "To"',
      field: FilterKeyEnum.DATE_TO,
      type: 'datePicker'
    }
  ];
}
