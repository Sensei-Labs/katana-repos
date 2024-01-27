import dynamic from 'next/dynamic';
import { Drawer, Form, Input, notification } from 'antd';

import Title from '@/Components/Atoms/Title';
import { createNews, NewsType, PayloadCreateNews } from '@/fetches/news';
import useTraceSync from '@/hooks/useTraceSync';
import Button from '@/Components/Atoms/Button';
import { formatErrorMessage } from '@/utils/formatError';
import { useProjectOne } from '@/Contexts/ProjectOne';

const Editor = dynamic(() => import('@/Components/Atoms/Editor'), {
  ssr: false
});

type ModalCreateNewProps = {
  isOpen: boolean;
  onClose: () => void;
  onCompletedSuccess: (data: NewsType) => void;
};

const defaultRules = {
  required: true,
  rules: [
    {
      required: true
    }
  ]
};

const ModalCreateNew = ({
  onClose,
  isOpen,
  onCompletedSuccess
}: ModalCreateNewProps) => {
  const [form] = Form.useForm();
  const { treasury } = useProjectOne();
  const [isLoading, onTrace] = useTraceSync();

  const onSubmit = async (payload: PayloadCreateNews) => {
    if (!treasury) {
      return notification.warning({
        message: 'Selecting a treasury',
        description: 'Please waiting a moment and retry'
      });
    }
    try {
      payload.project = treasury.id;
      const { data } = await onTrace(() => createNews({ payload }));
      onClose();
      onCompletedSuccess(data?.data);
      notification.success({
        message: 'Creating a news',
        description: 'News created successfully'
      });
    } catch (e) {
      console.log(e);
      notification.error({
        message: 'Error creating a news',
        description: formatErrorMessage(e)
      });
    }
  };

  return (
    <Drawer
      width={950}
      open={isOpen}
      onClose={onClose}
      title={<Title>Create a news</Title>}
      afterVisibleChange={() => {
        form.resetFields();
      }}
    >
      <Form onFinish={onSubmit} layout="vertical" form={form}>
        <Form.Item {...defaultRules} label="Title" name="title">
          <Input placeholder="Insert a title" />
        </Form.Item>
        <Form.Item
          {...defaultRules}
          name="shortContent"
          label="Short Description"
        >
          <Input.TextArea rows={5} placeholder="Insert a short description" />
        </Form.Item>
        <Form.Item {...defaultRules} label="Content" name="content">
          <Editor />
        </Form.Item>
        <Form.Item>
          <div className="flex gap-2 justify-end items-center">
            <Button
              onClick={onClose}
              color="text-primary"
              bgColor="bg-transparent"
              borderColor="border-primary"
            >
              Cancel
            </Button>
            <Button htmlType="submit" loading={isLoading}>
              Create
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ModalCreateNew;
