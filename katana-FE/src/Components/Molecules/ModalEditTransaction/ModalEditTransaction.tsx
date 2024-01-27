import { useEffect } from 'react';
import { useSWRConfig } from 'swr';
import {
  Alert,
  Col,
  Empty,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Space
} from 'antd';

import Title from '@/Components/Atoms/Title';
import useTraceSync from '@/hooks/useTraceSync';
import { formatDateTime } from '@/utils/formatDateTime';
import CardInfo from '@/Components/Molecules/CardInfo';
import { useTransactions } from '@/Contexts/Transactions';
import { updateTransaction } from '@/fetches/transactions';
import { formatAmount, formatDisplayWallet } from '@/utils/generalFormat';
import SelectCategoryTransaction from '@/Components/Atoms/SelectCategoryTransaction';
import { asyncForMap } from '@/utils';
import Button from '@/Components/Atoms/Button';
import IconActions from '@/Components/Atoms/IconActions';

type ModalEditTransactionProps = {
  isOpen: boolean;
  onClose: () => void;
  data: TransactionType | null;
  transactionIds: number[] | null;
};

const setErrorForm = [
  {
    name: 'tag',
    errors: ['Select a value  or insert a description']
  },
  {
    name: 'description',
    errors: ['Insert a value or select a category']
  }
];

const ModalEditTransaction = ({
  isOpen,
  data,
  transactionIds,
  onClose
}: ModalEditTransactionProps) => {
  const [form] = Form.useForm();
  const [isLoading, onTracing] = useTraceSync();
  const { mutate } = useSWRConfig();
  const { internalPath } = useTransactions();
  const onSubmit = async (value: Record<string, any>) => {
    // For unique Item
    if (data?.id) {
      await onTracing(async () => {
        try {
          const payload = {
            tag: value?.tag
              ? {
                  connect: [Number(value.tag)]
                }
              : {
                  disconnect: data?.tag?.id ? [data.tag?.id] : []
                },
            description: value?.description
          };
          await updateTransaction(data?.id, payload);
          await mutate(internalPath);
        } catch (e: any) {
          notification.error({
            message: 'Error to edit',
            description: e?.message || 'Sorry, you can try later, please!'
          });
        }
      });

      return onClose();
    }

    // For many transactions
    if (transactionIds && Array.isArray(transactionIds)) {
      await onTracing(async () => {
        await asyncForMap(transactionIds, async (transactionId) => {
          try {
            const payload = {
              tag: value?.tag
                ? {
                    connect: [Number(value.tag)]
                  }
                : {
                    disconnect: data?.tag?.id ? [data.tag.id] : []
                  },
              description: value?.description || ''
            };
            await updateTransaction(transactionId, payload);
          } catch (e: any) {
            notification.error({
              message: 'Error to edit',
              description: e?.message || 'Sorry, you can try later, please!'
            });
          }
        });

        await mutate(internalPath);
      });

      return onClose();
    }
  };

  const resetValidation = () => {
    form.setFields(setErrorForm.map((f) => ({ ...f, errors: [] })));
  };

  const onRemoveCategory = () => {
    form.setFieldValue('tag', undefined);
  };

  useEffect(() => {
    if (data) {
      if (data?.tag) {
        form.setFieldValue('tag', data?.tag?.id);
      }
      if (data?.description) {
        form.setFieldValue('description', data?.description);
      }
    }
  }, [data, form]);

  return (
    <Modal
      open={isOpen}
      destroyOnClose
      okText="Update"
      onCancel={onClose}
      width={600}
      title={<Title>Edit Transaction</Title>}
      afterClose={() => {
        form.resetFields();
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
        layout="vertical"
        onFinish={onSubmit}
        onValuesChange={resetValidation}
      >
        {!data && !transactionIds?.length ? (
          <Empty />
        ) : (
          <Row gutter={[20, 20]}>
            {transactionIds?.length && (
              <Alert
                showIcon
                type="warning"
                message="Editing many transactions at the same time may take longer than usual, please go for a cup of coffee ☕️"
              />
            )}
            {data && (
              <>
                <Col xs={8} sm={12}>
                  <CardInfo label="Trx ID" value={data?.id} />
                </Col>
                <Col xs={16} sm={12}>
                  <CardInfo label="Date" value={formatDateTime(data?.date)} />
                </Col>
                <Col xs={24} sm={12}>
                  <CardInfo
                    label="Wallet From"
                    title={data?.fromUserAccount}
                    value={formatDisplayWallet(data?.fromUserAccount, 16)}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <CardInfo
                    label="Wallet To"
                    title={data?.toUserAccount}
                    value={formatDisplayWallet(data?.toUserAccount, 16)}
                  />
                </Col>
                <Col xs={24} sm={12}>
                  <CardInfo
                    label="Amount (SPL)"
                    value={formatAmount(data?.amount).format}
                  />
                </Col>
              </>
            )}
            <Col xs={24} sm={data ? 12 : 24}>
              <CardInfo
                label="Category"
                value={
                  <Row gutter={[10, 10]}>
                    <Col xs={20}>
                      <Form.Item className="mb-0 w-full" name="tag">
                        <SelectCategoryTransaction />
                      </Form.Item>
                    </Col>
                    <Col xs={4}>
                      <Button
                        variant="semi-trans"
                        onClick={onRemoveCategory}
                        icon={<IconActions type="close" />}
                      />
                    </Col>
                  </Row>
                }
              />
            </Col>
            <Col span={24}>
              <CardInfo
                label="Description"
                value={
                  <Form.Item name="description">
                    <Input.TextArea defaultValue={data?.description} />
                  </Form.Item>
                }
              />
            </Col>
          </Row>
        )}
      </Form>
    </Modal>
  );
};

export default ModalEditTransaction;
