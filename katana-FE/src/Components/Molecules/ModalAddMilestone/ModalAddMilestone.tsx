import { Col, DatePicker, Form, Input, Modal, notification, Row } from 'antd';
import { createMilestone } from '@/fetches/milestone';
import { formatErrorMessage } from '@/utils/formatError';
import useTraceSync from '@/hooks/useTraceSync';
import { useProjectOne } from '@/Contexts/ProjectOne';
import { useSWRConfig } from 'swr';

type AddMilestoneModalProps = {
  visible: boolean;
  onClose(): void;
};

const formName = 'create-milestone';
const requiredRule = [{ required: true }];

const ModalAddMilestone = ({ onClose, visible }: AddMilestoneModalProps) => {
  const [form] = Form.useForm();
  const { mutate } = useSWRConfig();
  const { treasury, internalPath } = useProjectOne();

  const [loading, onTrace] = useTraceSync();

  const onSubmit = async (values: {
    title: string;
    description: string;
    date: string;
  }) => {
    if (!treasury?.id) return null;
    try {
      await onTrace(() => createMilestone(treasury?.id, values));
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
        <Row gutter={[10, 10]}>
          <Col xs={24} md={12}>
            <Form.Item required rules={requiredRule} label="Title" name="title">
              <Input placeholder="Title" />
            </Form.Item>
          </Col>
          <Col xs={24} md={12}>
            <Form.Item required rules={requiredRule} label="Date" name="date">
              <DatePicker />
            </Form.Item>
          </Col>
        </Row>
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

export default ModalAddMilestone;
