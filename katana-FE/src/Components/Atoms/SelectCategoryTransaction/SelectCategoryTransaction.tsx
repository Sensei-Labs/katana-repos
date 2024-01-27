import useSWR from 'swr';
import { API_ROUTES } from '@/config/api';
import { fetcher } from '@/services/api';
import { Select, SelectProps } from 'antd';
import classNames from 'classnames';

type SelectCategoryTransactionProps = SelectProps & {};

export type CategoryTransaction = {
  name: string;
  color: string;
  id: number;
};

const SelectCategoryTransaction = ({
  className,
  ...props
}: SelectCategoryTransactionProps) => {
  const { data, isLoading } = useSWR<PaginationServer<CategoryTransaction>>(
    API_ROUTES.GET_ALL_CATEGORY_TRANSACTIONS.path,
    fetcher
  );
  return (
    <Select
      loading={isLoading}
      {...props}
      className={classNames('w-full', className)}
      options={
        data?.data?.map((item) => ({ label: item.name, value: item.id })) || []
      }
    />
  );
};

export default SelectCategoryTransaction;
