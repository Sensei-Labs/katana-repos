import { useSWRConfig } from 'swr';
import { useMemo, useState } from 'react';
import { Col, Form, Modal, notification, Row } from 'antd';

import { NFTTokenType } from '@/types/nft';
import Title from '@/Components/Atoms/Title';
import Select from '@/Components/Atoms/Select';
import useTraceSync from '@/hooks/useTraceSync';
import { NFTCard } from '@/Components/Molecules/Cards';
import { formatErrorMessage } from '@/utils/formatError';
import { addCollectionAddressTrack } from '@/fetches/treasury';
import { useProjectOne } from '@/Contexts/ProjectOne';

type ModalAddCollectionNotTrackProps = {
  isOpen: boolean;
  onClose: () => void;
};

const ModalAddCollectionNotTrack = ({
  isOpen,
  onClose
}: ModalAddCollectionNotTrackProps) => {
  const [form] = Form.useForm();
  const [isLoading, onTracing] = useTraceSync();
  const { mutate } = useSWRConfig();
  const [nftPreview, setNftPreview] = useState<NFTTokenType[]>([]);
  const {
    internalPath,
    allCollections,
    collections: collectionsAdded,
    treasury,
    loading
  } = useProjectOne();
  const treasuryId = treasury?.id || '';

  const collections = useMemo(() => {
    const collectionsArray = collectionsAdded.map((item) => item?.address);
    return allCollections.filter(
      (item) => !collectionsArray.includes(item?.address)
    );
  }, [allCollections, collectionsAdded]);

  const onSubmit = async (value: Record<string, any>) => {
    if (!treasuryId) return null;
    await onTracing(async () => {
      try {
        await addCollectionAddressTrack(treasuryId, {
          acceptedCollectionAddress: value.acceptedCollectionAddress
        });
        await mutate(internalPath);
      } catch (e) {
        notification.error({
          message: 'Error to aggregate address',
          description: formatErrorMessage(e)
        });
      }
    });

    return onClose();
  };

  const nftReferenceRender = ({
    acceptedCollectionAddress
  }: {
    acceptedCollectionAddress: string;
  }) => {
    const findCollection = collections.find(
      (collection) =>
        collection?.address?.toString() === acceptedCollectionAddress
    );
    return setNftPreview(findCollection?.docs?.slice(0, 4) || []);
  };

  return (
    <Modal
      open={isOpen}
      destroyOnClose
      okText="Add"
      onCancel={onClose}
      title={<Title>Add collection to hide</Title>}
      afterClose={() => {
        form.resetFields();
        setNftPreview([]);
      }}
      cancelButtonProps={{
        disabled: isLoading
      }}
      okButtonProps={{
        onClick: form.submit,
        loading: isLoading
      }}
    >
      <Form
        form={form}
        onValuesChange={nftReferenceRender}
        layout="vertical"
        onFinish={onSubmit}
      >
        <Form.Item label="Collection" name="acceptedCollectionAddress">
          <Select
            loading={loading}
            items={collections.map(({ name, address }) => ({
              label: name || '-- Not have Name --',
              value: address?.toString() || ''
            }))}
          />
        </Form.Item>

        <Form.Item>
          <Row gutter={[10, 10]}>
            {nftPreview.map((nft, index) => {
              console.log(nft);
              return (
                <Col
                  key={`${nft.mintAddress.toString()}-${index}`}
                  xs={12}
                  md={8}
                >
                  <NFTCard
                    collectionName=""
                    description=""
                    size="small"
                    image={nft.image}
                    name={nft.name}
                  />
                </Col>
              );
            })}
          </Row>
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModalAddCollectionNotTrack;
