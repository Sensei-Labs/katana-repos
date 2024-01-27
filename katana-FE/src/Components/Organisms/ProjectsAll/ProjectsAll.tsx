import Link from 'next/link';
import classNames from 'classnames';

import { ROUTES } from '@/config';
import { Col, Row } from '@/Components/Atoms/Grid';
import { useTreasuryList } from '@/Contexts/Projects';
import { SkeletonNFT } from '@/Components/Atoms/Skeleton';
import { ProjectCard } from '@/Components/Molecules/Cards';
import resolveUrl from '@/utils/resolveUrl';
import Button from '@/Components/Atoms/Button';
import { Empty } from 'antd';

const LoadingSkeleton = ({ limit }: { limit: number }) => {
  const arrayKeys = Array.from(Array(limit).keys());
  return (
    <>
      {arrayKeys.map((item) => (
        <Col key={item} xs={24} md={12} lg={8} xl={6}>
          <SkeletonNFT />
        </Col>
      ))}
    </>
  );
};

const ProjectsAll = () => {
  const { list, loading, limit, isExistNextPage, onNextPage } =
    useTreasuryList();

  return (
    <div className={classNames('mt-8')}>
      {!loading && !list.length && (
        <div className="pt-5">
          <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        </div>
      )}

      <Row gutter={[20, 20]}>
        {loading && !list.length && <LoadingSkeleton limit={limit} />}

        {list.map(
          ({ name, description, id, thumbnail, collectionCount, tags }) => {
            return (
              <Col key={id} xs={24} md={12} lg={8} xl={6}>
                <Link
                  passHref
                  href={resolveUrl(
                    ROUTES.DASHBOARD.path,
                    ROUTES.DASHBOARD.params.address,
                    id
                  )}
                >
                  <ProjectCard
                    projectName={name}
                    description={description}
                    tags={tags?.map((tag) => tag.name) || []}
                    image={thumbnail?.url || ''}
                    numberCollections={collectionCount || 0}
                  />
                </Link>
              </Col>
            );
          }
        )}

        {loading && !!list.length && <LoadingSkeleton limit={limit} />}
      </Row>

      {isExistNextPage && (
        <div className="text-center my-10">
          <Button disabled={loading} onClick={onNextPage}>
            Show more
          </Button>
        </div>
      )}
    </div>
  );
};
export default ProjectsAll;
