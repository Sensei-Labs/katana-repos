import dynamic from 'next/dynamic';
import { Drawer, Form, Input, notification } from 'antd';

import Title from '@/Components/Atoms/Title';
import { editNews, NewsType, PayloadCreateNews } from '@/fetches/news';
import useTraceSync from '@/hooks/useTraceSync';
import Button from '@/Components/Atoms/Button';
import { formatErrorMessage } from '@/utils/formatError';
import { NewItemProps } from '@/Components/Organisms/NewList/NewList';
import { useEffect } from 'react';

const Editor = dynamic(() => import('@/Components/Atoms/Editor'), {
  ssr: false
});

type ModalEditNewProps = {
  isOpen: boolean;
  onClose: () => void;
  itemData: NewItemProps;
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

const ModalEditNew = ({
  onClose,
  isOpen,
  itemData,
  onCompletedSuccess
}: ModalEditNewProps) => {
  const [form] = Form.useForm();
  const [isLoading, onTrace] = useTraceSync();

  const onSubmit = async (payload: PayloadCreateNews) => {
    try {
      const { data } = await onTrace(() => editNews(itemData.id, { payload }));
      onClose();
      onCompletedSuccess(data?.data);
      notification.success({
        message: 'Edite a news',
        description: 'Edit successfully'
      });
    } catch (e) {
      console.log(e);
      notification.error({
        message: 'Error editing a news',
        description: formatErrorMessage(e)
      });
    }
  };

  useEffect(() => {
    console.log(itemData);
    form.setFieldsValue(itemData);
  }, [itemData, form, isOpen]);

  return (
    <Drawer
      width={950}
      open={isOpen}
      onClose={onClose}
      title={<Title>Create a news</Title>}
      afterVisibleChange={(open) => {
        if (!open) {
          form.resetFields();
        }
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
              Edit
            </Button>
          </div>
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default ModalEditNew;
