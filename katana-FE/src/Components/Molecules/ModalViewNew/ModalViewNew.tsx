import { Drawer, Modal, Space } from 'antd';

import Title from '@/Components/Atoms/Title';
import Button from '@/Components/Atoms/Button';
import IconActions from '@/Components/Atoms/IconActions';
import { ScopeType } from '@/hooks/useRedirectTreasuryAccess';
import PermissionSection from '@/Components/Atoms/PermissionSection';
import { WysiwygStyle } from './style';

type ModalCreateNewProps = {
  id: number;
  title: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: (id: number) => Promise<void>;
};

const ModalViewNew = ({
  id,
  onClose,
  isOpen,
  title,
  content,
  onEdit,
  onDelete
}: ModalCreateNewProps) => {
  const onInternalDelete = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this news?',
      content: 'This action cannot be undone',
      okType: 'danger',
      onOk: async () => {
        await onDelete(id);
        onClose();
      }
    });
  };

  return (
    <Drawer
      width={950}
      open={isOpen}
      onClose={onClose}
      extra={
        <PermissionSection scope={[ScopeType.CAN_BE_WRITE]}>
          <Space>
            <Button
              onClick={() => {
                onEdit();
                onClose();
              }}
            >
              Edit
            </Button>
            <Button
              color="text-error"
              bgColor="bg-transparent"
              icon={<IconActions type="delete" />}
              onClick={onInternalDelete}
            />
          </Space>
        </PermissionSection>
      }
    >
      <Title fontFamily="font-sans">{title}</Title>

      <WysiwygStyle dangerouslySetInnerHTML={{ __html: content }} />
    </Drawer>
  );
};

export default ModalViewNew;
