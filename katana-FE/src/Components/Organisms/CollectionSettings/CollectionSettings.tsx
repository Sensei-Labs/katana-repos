import { mutate } from 'swr';
import { useCallback } from 'react';
import { Col, Collapse, Empty, Modal, notification, Row } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import useToggle from '@/hooks/useToggle';
import Text from '@/Components/Atoms/Text';
import Title from '@/Components/Atoms/Title';
import Button from '@/Components/Atoms/Button';
import { NFTCard } from '@/Components/Molecules/Cards';
import { formatErrorMessage } from '@/utils/formatError';
import IconActions from '@/Components/Atoms/IconActions';
import GridTwoColumn from '@/Components/Atoms/GridColumn';
import WrapperColor from '@/Components/Atoms/WrapperColor';
import { deleteCollectionAddressTrack } from '@/fetches/treasury';
import { useProjectOne } from '@/Contexts/ProjectOne';
import ModalAddCollectionNotTrack from '@/Components/Molecules/ModalAddCollectionNotTrack';

const CollectionSettings = () => {
  const { loading, treasury, internalPath, allCollections } = useProjectOne();
  const [visible, toggleVisible] = useToggle();

  const onDeleteAddress = (address: string) => {
    if (!treasury?.id) return null;
    return Modal.confirm({
      title: 'Do you want to delete these item?',
      icon: <ExclamationCircleFilled />,
      content: 'This action can not be undone',
      okText: 'Confirm',
      cancelText: 'Cancel',
      okButtonProps: {
        danger: true
      },
      async onOk() {
        try {
          await deleteCollectionAddressTrack(treasury.id, {
            acceptedCollectionAddress: address
          });

          await mutate(internalPath);
        } catch (e) {
          notification.error({
            message: `We couldn't perform this action`,
            description: formatErrorMessage(e)
          });
        }
      },
      onCancel() {}
    });
  };

  const getNftFromCollection = useCallback(
    (address: string) => {
      const findCollection = allCollections.find(
        (collection) => collection?.address?.toString() === address
      );

      return findCollection?.docs?.slice(0, 8) || [];
    },
    [allCollections]
  );

  return (
    <div>
      <GridTwoColumn
        first={
          <div>
            <Title fontFamily="font-sans">Accepted Collections</Title>
            <Text>
              Add the collections do you want to track to mount NTFs or metadata
            </Text>
          </div>
        }
        second={
          <Button
            onClick={toggleVisible}
            bgColor="bg-semi-transparent"
            icon={<IconActions type="add" />}
          >
            Add
          </Button>
        }
      />
      {!loading && (
        <WrapperColor bgColor="semi-transparent">
          <Collapse>
            {treasury?.acceptedCollectionAddress?.map((item) => {
              const nfts = getNftFromCollection(item);
              return (
                <Collapse.Panel
                  key={item}
                  header={item}
                  extra={
                    <Button
                      size="small"
                      key="list-delete"
                      color="text-error"
                      bgColor="bg-error-transparent-01"
                      icon={<IconActions type="delete" />}
                      onClick={() => onDeleteAddress(item)}
                    />
                  }
                >
                  {!nfts.length ? (
                    <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                  ) : (
                    <Row gutter={[10, 10]}>
                      {nfts.map((nft, index) => {
                        return (
                          <Col
                            key={`${(nft as any).edition}-${index}`}
                            xs={12}
                            md={6}
                          >
                            <NFTCard
                              name={nft.name}
                              image={nft.image}
                              collectionName={nft.collectionName}
                              description={nft.description}
                            />
                          </Col>
                        );
                      })}
                    </Row>
                  )}
                </Collapse.Panel>
              );
            })}
          </Collapse>
        </WrapperColor>
      )}

      <ModalAddCollectionNotTrack isOpen={visible} onClose={toggleVisible} />
    </div>
  );
};

export default CollectionSettings;
