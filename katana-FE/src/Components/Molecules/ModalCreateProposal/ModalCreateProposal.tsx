import { FC, useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Button, Drawer, Form, Input, notification } from 'antd';
import { RangePickerProps } from 'antd/es/date-picker';
import dayjs from 'dayjs';

import { ButtonsWrapper } from './style';
import { createProposal } from '@/fetches/proposals';
import { formatErrorMessage } from '@/utils/formatError';
import Title from '@/Components/Atoms/Title/Title';
import useTraceSync from '@/hooks/useTraceSync';
import { KeyedMutator } from 'swr';

const Editor = dynamic(() => import('@/Components/Atoms/Editor'), {
  ssr: false
});
const defaultRules = {
  required: true,
  rules: [
    {
      required: true
    }
  ]
};

interface Props {
  open: boolean;
  setOpen: (val: boolean) => void;
  toggleModal: () => void;
  treasury: string;
  refreshData: KeyedMutator<any>;
  drawerWidth: number;
}

const ModalCreateProposal: FC<Props> = ({
  open,
  setOpen,
  toggleModal,
  treasury,
  refreshData,
  drawerWidth
}) => {
  const [form] = Form.useForm();
  const [loading, onTrace] = useTraceSync();
  const [modalWidth, setModalWidth] = useState(drawerWidth);

  const onSubmit = async (value: Record<string, any>) => {
    if (!value.title || !value.description || !treasury) return;

    const description = String(value.description.slice(3, -4));

    const body = {
      title: value.title,
      description,
      treasury
    };

    try {
      await onTrace(() => createProposal(body));
      setOpen(false);
      refreshData();
      form.resetFields();
    } catch (error) {
      const e = formatErrorMessage(error);
      form.resetFields();
      notification.error({
        message: 'Oops!',
        description: e
      });
      setOpen(false);
    }
  };

  const onClose = () => {
    toggleModal();
    form.resetFields();
  };

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    // Can not select days before today and today
    return current && current < dayjs().endOf('day');
  };

  useEffect(() => {
    setModalWidth(drawerWidth);
  }, [drawerWidth]);

  return (
    <Drawer
      width={modalWidth}
      open={open}
      onClose={onClose}
      title={<Title withMargin={false}>Create a proposal</Title>}
    >
      <Form form={form} onFinish={onSubmit} layout="vertical">
        <Form.Item label="Title" name="title" {...defaultRules}>
          <Input placeholder="Add a title" />
        </Form.Item>
        <Form.Item
          label="Description"
          name="description"
          {...defaultRules}
          // className="text-white"
        >
          <Editor />
        </Form.Item>
        {/* <StyledWrapper>
          <Form.Item label="Approval Quorum" name="quorum" {...defaultRules}>
            <InputNumber
              className="w-full"
              type="number"
              placeholder="Add approval quorum"
              min={1}
            />
          </Form.Item>
          <Form.Item label="Deadline" name="date" {...defaultRules}>
            <DatePicker className="w-full" disabledDate={disabledDate} />
          </Form.Item>
        </StyledWrapper> */}
        <ButtonsWrapper>
          <Button className="mr-4" onClick={onClose}>
            Cancel
          </Button>
          <Button htmlType="submit" type="primary" loading={loading}>
            Create Proposal
          </Button>
        </ButtonsWrapper>
      </Form>
    </Drawer>
  );
};

export default ModalCreateProposal;
