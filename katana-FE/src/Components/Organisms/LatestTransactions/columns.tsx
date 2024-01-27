import { ColumnsType } from 'antd/es/table';
import { useColumn as useBaseColumns } from '@/Components/Organisms/AllTransactions/columns';

export const useColumn = (): ColumnsType<any> => {
  return useBaseColumns();
};

export default useColumn;
