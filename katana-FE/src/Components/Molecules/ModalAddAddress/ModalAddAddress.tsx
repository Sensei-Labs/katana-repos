import { ReactNode, useEffect } from 'react';
import { useSWRConfig } from 'swr';
import { Form, Input, Modal, notification } from 'antd';

import Title from '@/Components/Atoms/Title';
import useTraceSync from '@/hooks/useTraceSync';
import { formatErrorMessage } from '@/utils/formatError';
import { useProjectOne } from '@/Contexts/ProjectOne';

type ModalAddCollectionNotTrackProps = {
  isOpen: boolean;
  title?: string;
  onClose: () => void;
  item?: any;
  onEditFinish?: (id: number, payload: any) => Promise<any>;
  onFinnish: (treasuryId: number, payload: any) => Promise<any>;
  prefix?: ReactNode;
};

const ModalAddAddress = ({
  isOpen,
  onClose,
  prefix,
  item,
  onEditFinish,
  onFinnish,
  title = 'Add admin'
}: ModalAddCollectionNotTrackProps) => {
  const [form] = Form.useForm();
  const [isLoading, onTracing] = useTraceSync();
  const { mutate } = useSWRConfig();
  const { internalPath, treasury, loading } = useProjectOne();
  const treasuryId = treasury?.id || '';

  const onSubmit = async (values: Record<string, any>) => {
    if (!treasuryId) return null;
    await onTracing(async () => {
      try {
        await (item && onEditFinish ? onEditFinish : onFinnish)(
          treasuryId,
          values
        );
        await mutate(internalPath);
      } catch (e) {
        notification.error({
          message: 'Error to add address',
          description: formatErrorMessage(e)
        });
      }
    });

    return onClose();
  };

  useEffect(() => {
    form.setFieldsValue(item || {});
  }, [form, item]);

  return (
    <Modal
      open={isOpen}
      destroyOnClose
      onCancel={onClose}
      title={<Title>{title}</Title>}
      okText={item ? 'Update' : 'Save'}
      afterClose={() => {
        form.resetFields();
      }}
      cancelButtonProps={{
        disabled: isLoading || loading
      }}
      okButtonProps={{
        onClick: form.submit,
        loading: isLoading
      }}
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        {prefix}
        <Form.Item label="Address" name="address">
          <Input disabled={!!item} placeholder="Add address wallet" />
        </Form.Item>
      </Form>
    </Modal>
  );
};
export default ModalAddAddress;
