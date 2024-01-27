import { Col, Form, Input, message, Modal, Row } from 'antd';

import Title from '@/Components/Atoms/Title';
import UploadForm from '@/Components/Atoms/UploadForm';
import { useScope } from '@/Contexts/Scope';
import { useEffect } from 'react';
import useTraceSync from '@/hooks/useTraceSync';
import { updateUser } from '@/fetches/auth';
import { ROUTES } from '@/config';
import DiscordButton from '@/Components/Atoms/DiscordButton/DiscordButton';
import TwitterButton from '@/Components/Atoms/TwitterButton/TwitterButton';

export default function ModalFormAccount({
  open,
  onClose
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [loading, onTraceSync] = useTraceSync();
  const { user, onLogin, discordUserInfo } = useScope();
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      const deepClone = JSON.parse(JSON.stringify(user));
      form.setFieldsValue(deepClone);
    }
  }, [form, user]);

  const onSubmit = async (values: any) => {
    if (!user?.id) return null;
    await onTraceSync(async () => {
      await updateUser(user?.id, values);
      discordUserInfo && (await onLogin(discordUserInfo));
      message.success('Account updated');
      onClose();
    });
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      destroyOnClose={true}
      okText="Edit"
      okButtonProps={{
        loading,
        onClick: () => form.submit()
      }}
      afterClose={() => form.resetFields()}
      title={<Title level="h2">Account Settings</Title>}
    >
      <div className="mt-5">
        <Form onFinish={onSubmit} form={form}>
          <Form.Item name="avatar" className="text-center">
            <UploadForm
              width={150}
              height={150}
              returnKey="url"
              raw={{
                url: user?.avatar || ''
              }}
            />
          </Form.Item>
          <Row className="mt-5" gutter={[10, 10]}>
            <Col xs={24}>
              <Form.Item name="username">
                <Input disabled placeholder="Username" />
              </Form.Item>
            </Col>
            <Col xs={24}>
              <Form.Item name="email">
                <Input disabled placeholder="Email" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
        <div className="flex gap-5 justify-center">
          {!!user?.discordToken && <DiscordButton text="Connected" disabled />}

          {!user?.twitterToken && (
            <a key="twitter" className="flex" href={ROUTES.TWITTER_AUTH.path}>
              <TwitterButton />
            </a>
          )}

          {!!user?.twitterToken && <TwitterButton text="Connected" disabled />}
        </div>
      </div>
    </Modal>
  );
}
