import { Col, Form, Input, notification, Row } from 'antd';

import useToggle from '@/hooks/useToggle';
import Text from '@/Components/Atoms/Text';
import Title from '@/Components/Atoms/Title';
import Button from '@/Components/Atoms/Button';
import IconActions from '@/Components/Atoms/IconActions';
import GridTwoColumn from '@/Components/Atoms/GridColumn';
import { TreasuryAddressType } from '@/Contexts/Projects';
import { useProjectOne } from '@/Contexts/ProjectOne';
import ListWithActions from '@/Components/Molecules/ListWithActions';
import ModalAddAddress from '@/Components/Molecules/ModalAddAddress';
import {
  addTreasuryAddressFromTreasury,
  deleteTreasuryAddressesFromTreasury,
  editTreasuryAddressFromTreasury
} from '@/fetches/treasury';
import { formatErrorMessage } from '@/utils/formatError';
import { useState } from 'react';

const TreasuryAddressSettings = () => {
  const { loading, treasury } = useProjectOne();
  const [visible, toggleVisible] = useToggle();
  const [itemToEdit, setItemToEdit] = useState<TreasuryAddressType | null>(
    null
  );

  const onDelete = (id: number) => {
    try {
      if (treasury?.id) {
        return deleteTreasuryAddressesFromTreasury(treasury.id, { id });
      }
    } catch (e) {
      notification.error({
        message: 'Cannon delete address',
        description: formatErrorMessage(e)
      });
    }
  };

  const onEdit = async (idTreasury: number, payload: any) => {
    try {
      if (!itemToEdit) return null;
      return editTreasuryAddressFromTreasury(itemToEdit.id, payload);
    } catch (e) {
      notification.error({
        message: 'Cannon delete address',
        description: formatErrorMessage(e)
      });
    }
  };

  const onClickEdit = (item: TreasuryAddressType) => {
    setItemToEdit(item);
    toggleVisible();
  };

  return (
    <div>
      <GridTwoColumn
        first={
          <div>
            <Title fontFamily="font-sans">Treasury Address</Title>
            <Text>
              Add project&apos;s treasury wallets to start tracking transactions
              and NFTs
            </Text>
          </div>
        }
        second={
          <Button
            onClick={toggleVisible}
            bgColor="bg-semi-transparent"
            className="items-center flex"
            icon={<IconActions type="add" />}
          >
            Add
          </Button>
        }
      />

      <ListWithActions<TreasuryAddressType>
        loading={loading}
        onEdit={onClickEdit}
        data={treasury?.treasuryAddresses || []}
        renderItem={(item) => item.label}
        onDelete={(item) => onDelete(item.id)}
        renderDescription={(item) => item.address}
        renderAvatar={(item) => (
          <div
            className="rounded w-5 h-5"
            style={{ backgroundColor: item.color }}
          />
        )}
      />

      <ModalAddAddress
        isOpen={visible}
        onEditFinish={onEdit}
        onClose={toggleVisible}
        item={itemToEdit}
        title="Add Treasury Address"
        onFinnish={addTreasuryAddressFromTreasury}
        prefix={
          <Row gutter={[15, 15]}>
            <Col xs={24} md={8}>
              <Form.Item key="color" label="Color" name="color">
                <Input type="color" />
              </Form.Item>
            </Col>
            <Col xs={24} md={16}>
              <Form.Item key="label" label="Name" name="label">
                <Input placeholder="Principal Address" />
              </Form.Item>
            </Col>
          </Row>
        }
      />
    </div>
  );
};

export default TreasuryAddressSettings;
