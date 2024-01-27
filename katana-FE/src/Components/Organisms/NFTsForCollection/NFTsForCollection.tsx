import { Skeleton } from 'antd';
import { useMemo } from 'react';

import Button from '@/Components/Atoms/Button';
import { Col, Row } from '@/Components/Atoms/Grid';
import { NFTCard } from '@/Components/Molecules/Cards';
import { useProjectOne } from '@/Contexts/ProjectOne';
import Container from '@/Components/Atoms/Container';

type NFTsForCollectionProps = {
  indexCollections: number;
  address?: string;
  collectionName: string;
};

const NFTsForCollection = ({
  indexCollections,
  address,
  collectionName
}: NFTsForCollectionProps) => {
  const { collections, firstLoading, loading } = useProjectOne();

  const currentCollections = useMemo(() => {
    const findIndex = collections.findIndex(
      (item) =>
        item?.address?.toString() === address || item.key === indexCollections
    );
    return (
      collections[findIndex] || {
        docs: [],
        isValidNext: false
      }
    );
  }, [indexCollections, address, collections]);

  return (
    <Container className="px-0 mt-5">
      {firstLoading ? (
        <Skeleton active />
      ) : (
        <div>
          <Row gutter={[10, 10]} className="max-w-full" justify="center">
            {currentCollections?.docs?.map(
              ({ image, name, description, marketInfo }, index) => {
                return (
                  <Col xs={24} sm={12} lg={8} xxl={5} key={index}>
                    <NFTCard
                      name={name}
                      image={image}
                      marketInfo={marketInfo}
                      description={description}
                      collectionName={collectionName}
                    />
                  </Col>
                );
              }
            )}
          </Row>
          {currentCollections?.isValidNext && (
            <Button
              loading={loading}
              className="block mt-10 mb-10 mx-auto"
              onClick={currentCollections?.onNext}
            >
              Show More!
            </Button>
          )}
        </div>
      )}
    </Container>
  );
};

export default NFTsForCollection;
