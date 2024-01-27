import Link from 'next/link';
import dynamic from 'next/dynamic';
import { Col, Empty, Result, Row, Skeleton, Space, Tabs, Tag } from 'antd';

import { ROUTES } from '@/config';
import Title from '@/Components/Atoms/Title';
import Button from '@/Components/Atoms/Button';
import { useStatistic } from '@/Contexts/Statistic';
import { useProjectOne } from '@/Contexts/ProjectOne';
import { useTransactions } from '@/Contexts/Transactions';
import GridTwoColumn from '@/Components/Atoms/GridColumn';
import { LineChart } from '@/Components/Molecules/Graphs';
import WrapperColor from '@/Components/Atoms/WrapperColor';
import IconActions from '@/Components/Atoms/IconActions';
import DoughnutChart from '@/Components/Molecules/Graphs/DoughnutChart';
import NFTsForCollection from '@/Components/Organisms/NFTsForCollection';
import HeadGraphic, {
  optionsForLine,
  optionsForPie
} from 'src/Components/Molecules/HeadGraphic';

import LatestTransactions from '@/Components/Organisms/LatestTransactions';
import { StyleDashboard } from './style';

const TreasuryInfo = dynamic(import('@/Components/Organisms/TreasuryInfo'), {
  ssr: false
});

const DashboardTemplate = () => {
  const { loading, treasury, collections } = useProjectOne();
  const {
    line,
    pie,
    showLineRoyalties,
    showPieRoyalties,
    onChangeTimeFilter,
    onRefresh,
    onShowRoyalties,
    pieTimeFilter,
    lineTimeFilter
  } = useStatistic();
  const { isLoadingLatest, latestTransactions } = useTransactions();

  if (!loading && !treasury) {
    return (
      <Result
        status="404"
        title="404"
        subTitle="Sorry, the page you visited does not exist."
        extra={
          <Link href={ROUTES.TREASURIES.path}>
            <Button type="primary">Back Home</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div>
      <StyleDashboard
        $principalColor={treasury?.principalColor}
        $secondaryColor={treasury?.secondaryColor}
      />

      <TreasuryInfo />

      <Row gutter={[20, 20]} className="mt-10">
        <Col xs={24} lg={15}>
          <WrapperColor>
            <GridTwoColumn
              firstClassName="opacity-1 mb-0"
              first={
                <Title withMargin={false} level="h3">
                  Expense Trends
                </Title>
              }
              second={
                <Button
                  variant="semi-trans"
                  disabled={line.loading}
                  loading={line.loadingRefresh}
                  onClick={() => onRefresh('line')}
                  icon={<IconActions type="reload" style={{ fontSize: 14 }} />}
                />
              }
            />
            <HeadGraphic
              type="line"
              className="mb-10"
              loading={line.loading}
              options={optionsForLine}
              timeFilter={lineTimeFilter}
              onShowRoyalties={onShowRoyalties}
              activeRoyalty={showLineRoyalties}
              onChangeTimeFilter={onChangeTimeFilter}
            />
            <LineChart
              data={line.data}
              labels={line.labels}
              colors={line.colors}
              loading={line.loading}
            />
          </WrapperColor>
        </Col>

        <Col xs={24} lg={9}>
          <WrapperColor>
            <GridTwoColumn
              align="start"
              firstClassName="opacity-1"
              first={
                <Space>
                  <Title withMargin={false} level="h3">
                    Category Breakdown
                  </Title>
                </Space>
              }
              second={
                <Button
                  variant="semi-trans"
                  disabled={pie.loading}
                  loading={pie.loadingRefresh}
                  onClick={() => onRefresh('pie')}
                  icon={<IconActions type="reload" style={{ fontSize: 14 }} />}
                />
              }
            />
            <HeadGraphic
              type="pie"
              className="mb-10"
              loading={pie.loading}
              options={optionsForPie}
              timeFilter={pieTimeFilter}
              activeRoyalty={showPieRoyalties}
              onShowRoyalties={onShowRoyalties}
              onChangeTimeFilter={onChangeTimeFilter}
            />
            <DoughnutChart
              data={{
                labels: pie.labels,
                name: 'Pie graph',
                values: pie.values
              }}
              colors={pie.colors}
              loading={pie.loading}
            />
          </WrapperColor>
        </Col>
      </Row>

      <div className="h-20" />

      <LatestTransactions
        data={latestTransactions}
        isLoading={isLoadingLatest}
      />

      <div className="h-20" />

      <Title
        fontSize="3rem"
        className="mt-0"
        lineHeight="3.2rem"
        fontFamily="font-sans"
      >
        NFTs Held
      </Title>

      {loading && !collections.length && <Skeleton active />}
      {!loading && !collections.length && (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}

      <Tabs
        size="large"
        defaultActiveKey={collections?.[0]?.key?.toString()}
        items={
          collections?.map((collection, index) => {
            return {
              key: collection.key.toString(),
              label: (
                <>
                  {collection.name.replace('.json', '')}
                  <Tag color="blue" className="ml-1">
                    {collection.totalCount}
                  </Tag>
                </>
              ),
              children: (
                <NFTsForCollection
                  key={collection.key}
                  indexCollections={index}
                  address={collection?.address?.toString()}
                  collectionName={collection?.name || ''}
                />
              )
            };
          }) || []
        }
      />
    </div>
  );
};
export default DashboardTemplate;
