import useSWR from 'swr';
import { Col, Row, Spin } from 'antd';
import { PaperDownload } from 'react-iconly';

import { fetcher } from '@/services/api';
import Text from '@/Components/Atoms/Text';
import Title from '@/Components/Atoms/Title';
import Button from '@/Components/Atoms/Button';
import { formatMoney } from '@/utils/generalFormat';
import { useProjectOne } from '@/Contexts/ProjectOne';
import { CardInfo } from '@/Components/Molecules/Cards';
import { useTransactions } from '@/Contexts/Transactions';
import { getMetadataForProject } from '@/fetches/treasury';
import AllTransactions from '@/Components/Organisms/AllTransactions';
import useDrawerSettings from '@/Components/Templates/TreasuryDetails/Transactions/useDrawerSettings';
import { FilterHeaderTransactions } from '@/Components/Molecules/FilterHeader';
import classNames from 'classnames';

const Transactions = () => {
  const {
    loading: loadingTreasury,
    totalAccountBalance,
    treasury
  } = useProjectOne();
  const settings = useDrawerSettings();

  const { data } = useSWR<{
    totalInputSol: number;
    totalInputUsd: number;
    totalOutputSol: number;
    totalOutputUsd: number;
  }>(getMetadataForProject(treasury?.id), fetcher);

  const {
    pagination,
    loading,
    onChangePage,
    transactionLoading,
    setLimit,
    isLoadingDownload,
    downloadFile,
    transactionsCount
  } = useTransactions();

  return (
    <div>
      <div
        className={classNames([
          'flex flex-col justify-center items-end mt-8 mb-8 gap-3 flex-wrap',
          'md:flex-row md:justify-between md:items-center'
        ])}
      >
        <div className="w-full lg:w-auto">
          <Title fontSize={40} fontFamily="font-sans">
            Transactions{' '}
            {transactionLoading || loadingTreasury || loading ? (
              <Spin size="small" />
            ) : null}
          </Title>

          <Text color="text-secondaryText2">
            <b>{transactionsCount || 0}</b> Transactions
          </Text>
        </div>

        <Button
          variant="semi-trans"
          onClick={downloadFile}
          loading={isLoadingDownload}
          icon={<PaperDownload set="bold" />}
        >
          Download CSV
        </Button>
      </div>

      <Row gutter={[20, 20]} className="mb-8">
        <Col xs={24} sm={12} lg={8}>
          <CardInfo
            convertToUSD
            label="Total SOL Balance"
            value={totalAccountBalance?.parserNumber || 0}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <CardInfo
            convertToUSD
            label="Total Inflow"
            value={data?.totalInputSol || 0}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <CardInfo
            convertToUSD
            label="Total Outflow"
            value={data?.totalOutputSol || 0}
          />
        </Col>
      </Row>

      <FilterHeaderTransactions settingsFilter={settings} />

      <AllTransactions
        onLimitChange={setLimit}
        onChangePage={onChangePage}
        data={pagination?.data || []}
        isLoading={transactionLoading}
        pagination={pagination?.meta?.pagination}
      />
    </div>
  );
};

export default Transactions;
