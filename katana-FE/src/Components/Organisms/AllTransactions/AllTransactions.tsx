import { Key, useState } from 'react';
import type { TableProps } from 'antd';

import Title from '@/Components/Atoms/Title';
import Button from '@/Components/Atoms/Button';
import Table from '@/Components/Molecules/Table';
import { useProjectOne } from '@/Contexts/ProjectOne';
import IconActions from '@/Components/Atoms/IconActions';
import { useTransactions } from '@/Contexts/Transactions';
import useColumn from './columns';
import { DirectionSort, SorterType } from '@/Contexts/Transactions/types';

type AllTransactionsProps = {
  data: any[];
  pagination?: PaginationType;
  isLoading?: boolean;
  onChangePage(newPage: number): void;
  onLimitChange(limit: number): void;
};
const AllTransactions = ({
  data,
  pagination,
  onChangePage,
  onLimitChange,
  isLoading
}: AllTransactionsProps) => {
  const { scopeTreasury } = useProjectOne();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const { toggleModalTransaction, onEditRows, onChangeSorter } =
    useTransactions();
  const columns = useColumn(
    toggleModalTransaction,
    selectedRowKeys as number[],
    true
  );

  const onSelectChange = (newSelectedRowKeys: Key[]) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };

  const onChangeFiltersAndSort: TableProps<any>['onChange'] = (
    pagination,
    filters,
    sorter
  ) => {
    const sort = sorter as { field: SorterType; order: DirectionSort };
    onChangeSorter(sort.field, sort.order);
  };

  const hasSelected = selectedRowKeys.length > 0;

  return (
    <>
      {hasSelected && (
        <div className="flex justify-between items-center mb-3">
          <Title fontFamily="font-sans" fontSize="1rem" level="h4">
            Selected {selectedRowKeys.length} items
          </Title>
          <Button
            icon={<IconActions type="edit" />}
            onClick={() => onEditRows(selectedRowKeys as number[])}
          >
            Edit
          </Button>
        </div>
      )}

      <Table
        variant="space"
        columns={columns}
        dataSource={data}
        loading={isLoading}
        onChange={onChangeFiltersAndSort}
        rowSelection={
          scopeTreasury?.canBeWrite
            ? {
                selectedRowKeys,
                onChange: onSelectChange
              }
            : undefined
        }
        scroll={{
          x: true
        }}
        pagination={
          pagination
            ? {
                pageSize: pagination.pageSize,
                current: pagination.page,
                total: pagination.total,
                onChange: onChangePage,
                onShowSizeChange: (current, size) => onLimitChange(size)
              }
            : undefined
        }
      />
    </>
  );
};

export default AllTransactions;
