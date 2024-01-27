import Link from 'next/link';
import { useMemo } from 'react';
import { Col, Empty, Result, Row, Tabs, Tag } from 'antd';

import { ROUTES } from '@/config';
import Text from '@/Components/Atoms/Text';
import Title from '@/Components/Atoms/Title';
import Button from '@/Components/Atoms/Button';
import { formatMoney } from '@/utils/generalFormat';
import { useProjectOne } from '@/Contexts/ProjectOne';
import { NFTCard } from '@/Components/Molecules/Cards';
import SolanaIcon from '@/Components/Atoms/Icons/Solana';
import WrapperColor from '@/Components/Atoms/WrapperColor';
import { DoughnutChart } from '@/Components/Molecules/Graphs';
import NFTsForCollection from '@/Components/Organisms/NFTsForCollection';

const NFTTemplate = () => {
  const { loading, treasury, collections, allCollections, nfts } =
    useProjectOne();

  const { totalAmountCollections, totalAmountCollectionsUsd } = useMemo(() => {
    if (!allCollections)
      return { totalAmountCollections: 0, totalAmountCollectionsUsd: 0 };

    return allCollections.reduce(
      (acc, collection) => {
        return {
          totalAmountCollections:
            acc.totalAmountCollections +
            (collection?.collectionInfo?.collectionPrice || 0),
          totalAmountCollectionsUsd:
            acc.totalAmountCollectionsUsd +
            (collection?.collectionInfo?.collectionPriceUsd || 0)
        };
      },
      { totalAmountCollections: 0, totalAmountCollectionsUsd: 0 }
    );
  }, [allCollections]);

  const NFTWithMoreFloorPrice = useMemo(() => {
    if (!nfts) return [];

    const orderingNfts = nfts.sort((a, b) => {
      return (b?.marketInfo?.priceSol || 0) - (a?.marketInfo?.priceSol || 0);
    });

    return orderingNfts.slice(0, 4);
  }, [nfts]);

  const dataCollectionsGraphData = useMemo(() => {
    const labels: string[] = [];
    const values: number[] = [];

    collections?.forEach((collection) => {
      labels.push(collection.collectionInfo.collectionName);
      values.push(
        Number(formatMoney(collection.collectionInfo.collectionPriceUsd))
      );
    });

    return {
      name: 'NFTs Values',
      labels,
      values
    };
  }, [collections]);

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

  if (!loading && !collections.length) {
    return (
      <div>
        <Title fontSize="3rem" className="mt-0 mb-10" lineHeight="3.2rem">
          NFTs
        </Title>

        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    );
  }

  return (
    <div>
      <Row className="mb-10" gutter={[20, 20]}>
        <Col xs={24} xl={14}>
          <WrapperColor className="h-full">
            <div className="flex flex-wrap justify-between mb-10">
              <Title fontSize="3rem" className="mt-0" lineHeight="3.2rem">
                NFTs
              </Title>
              <div>
                <Title withMargin={false}>
                  <SolanaIcon className="mr-1" />
                  {formatMoney(totalAmountCollections)} SOL ($
                  {formatMoney(totalAmountCollectionsUsd)})
                </Title>

                <Text className="text-right">Total Floor Value</Text>
              </div>
            </div>

            <Title className="mb-5">Most expensive NFTs</Title>

            <div className="flex justify-start gap-4 w-full overflow-x-auto pb-5">
              {NFTWithMoreFloorPrice.map((nft, index) => {
                return (
                  <NFTCard
                    key={index}
                    name={nft.name}
                    image={nft.image}
                    collectionName=""
                    style={{ width: 300 }}
                    className="flex-shrink-0"
                    marketInfo={nft.marketInfo}
                    description={nft.description}
                  />
                );
              })}
            </div>
          </WrapperColor>
        </Col>
        <Col xs={24} xl={10}>
          <WrapperColor className="h-full">
            <DoughnutChart
              data={dataCollectionsGraphData}
              header={
                <Title withMargin={false}>Wallets Value by Collection</Title>
              }
            />
          </WrapperColor>
        </Col>
      </Row>

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
export default NFTTemplate;
