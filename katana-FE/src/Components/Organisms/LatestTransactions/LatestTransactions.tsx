import Table from '@/Components/Molecules/Table';
import Title from '@/Components/Atoms/Title';
import { useColumn } from './columns';

type LatestTransactionsProps = {
  data: any[];
  isLoading?: boolean;
};
const LatestTransactions = ({ data, isLoading }: LatestTransactionsProps) => {
  const columns = useColumn();

  return (
    <div>
      <Title
        fontSize="3rem"
        className="mt-0"
        lineHeight="3.2rem"
        fontFamily="font-sans"
      >
        Latest Transactions
      </Title>
      <Table
        variant="space"
        columns={columns}
        dataSource={data}
        loading={isLoading}
        pagination={false}
        scroll={{
          x: true
        }}
      />
    </div>
  );
};

export default LatestTransactions;
