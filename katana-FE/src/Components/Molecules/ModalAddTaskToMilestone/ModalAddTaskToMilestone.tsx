import { useSWRConfig } from 'swr';
import { Form, Input, Modal, notification, Select } from 'antd';

import useTraceSync from '@/hooks/useTraceSync';
import { formatErrorMessage } from '@/utils/formatError';
import { useWallet } from '@solana/wallet-adapter-react';
import { createTaskInMilestone } from '@/fetches/milestone';
import { useProjectOne } from '@/Contexts/ProjectOne';
import { useMemo } from 'react';

type ModalAddTaskToMilestoneProps = {
  visible: boolean;
  onClose(): void;
};

const formName = 'create-tasks-milestone';
const requiredRule = [{ required: true }];

const ModalAddTaskToMilestone = ({
  onClose,
  visible
}: ModalAddTaskToMilestoneProps) => {
  const [form] = Form.useForm();
  const { mutate } = useSWRConfig();
  const { publicKey } = useWallet();
  const [loading, onTrace] = useTraceSync();
  const { internalPath, treasury } = useProjectOne();

  const optionsMilestone = useMemo(() => {
    if (!treasury?.milestones?.length) return [];
    return treasury?.milestones?.map(({ id, title }) => ({
      label: title,
      value: id
    }));
  }, [treasury?.milestones]);

  const onSubmit = async (values: {
    title: string;
    description: string;
    milestone: number;
    by: string;
  }) => {
    if (!publicKey) return null;
    try {
      values.by = publicKey.toString();

      await onTrace(() => createTaskInMilestone(values));
      await mutate(internalPath);
      onClose();
    } catch (e) {
      const error = formatErrorMessage(e);
      console.log(error);

      notification.error({
        message: 'Oops!',
        description: error
      });
    }
  };

  return (
    <Modal
      open={visible}
      okText="Create"
      onCancel={onClose}
      title="Add Milestone"
      afterClose={form.resetFields}
      okButtonProps={{
        loading,
        form: formName,
        htmlType: 'submit'
      }}
      cancelButtonProps={{
        disabled: loading
      }}
    >
      <Form form={form} id={formName} onFinish={onSubmit} layout="vertical">
        <Form.Item
          required
          name="milestone"
          label="Milestone"
          rules={requiredRule}
        >
          <Select placeholder="Select a milestone" options={optionsMilestone} />
        </Form.Item>
        <Form.Item required rules={requiredRule} label="Title" name="title">
          <Input placeholder="Title" />
        </Form.Item>
        <Form.Item
          required
          name="description"
          label="Description"
          rules={requiredRule}
        >
          <Input.TextArea rows={5} placeholder="Description" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalAddTaskToMilestone;
