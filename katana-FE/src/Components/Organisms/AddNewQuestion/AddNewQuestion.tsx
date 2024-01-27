import { Drawer, Form, Input, notification, Space } from 'antd';

import Button from '@/Components/Atoms/Button';
import useTraceSync from '@/hooks/useTraceSync';
import { formatErrorMessage } from '@/utils/formatError';
import { createQuestion, QuestionType } from '@/fetches/forum';
import { useProjectOne } from '@/Contexts/ProjectOne';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/Components/Atoms/Editor'), {
  ssr: false
});

type AddNewQuestionProps = {
  open?: boolean;
  onClose?: () => void;
  onRefresh?: () => void;
};

const AddNewQuestion = ({ onClose, open, onRefresh }: AddNewQuestionProps) => {
  const [form] = Form.useForm();
  const { treasury } = useProjectOne();
  const [loading, onTrace] = useTraceSync();

  const onSubmit = async (values: QuestionType) => {
    if (!treasury?.id) return null;
    try {
      await onTrace(() => createQuestion(treasury.id, values));
      onRefresh && onRefresh();
      onClose && onClose();
    } catch (e) {
      console.log(e);
      notification.error({
        message: 'Oops!',
        description: formatErrorMessage(e)
      });
    }
  };

  return (
    <Drawer
      open={open}
      width={720}
      onClose={onClose}
      maskClosable={!loading}
      afterOpenChange={(_open) => {
        if (!_open) form.resetFields();
      }}
      title="Create a new question"
      bodyStyle={{ paddingBottom: 80 }}
      extra={
        <Space>
          <Button
            disabled={loading}
            bgColor="bg-semi-transparent"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            loading={loading}
            onClick={form.submit}
            htmlType="submit"
            type="primary"
          >
            Submit
          </Button>
        </Space>
      }
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item name="title" label="Title" rules={[{ required: true }]}>
          <Input placeholder="Please enter a title" />
        </Form.Item>

        <Form.Item
          name="content"
          label="Description"
          rules={[
            {
              required: true,
              message: 'please enter a description'
            }
          ]}
        >
          <Editor />
        </Form.Item>
      </Form>
    </Drawer>
  );
};

export default AddNewQuestion;
