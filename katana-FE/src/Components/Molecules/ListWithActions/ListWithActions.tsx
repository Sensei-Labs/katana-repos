import { ReactNode, useCallback } from 'react';
import { useSWRConfig } from 'swr';
import { Empty, List, Modal, notification } from 'antd';
import { ExclamationCircleFilled } from '@ant-design/icons';

import Button from '@/Components/Atoms/Button';
import IconActions from '@/Components/Atoms/IconActions';
import { formatErrorMessage } from '@/utils/formatError';
import WrapperColor from '@/Components/Atoms/WrapperColor';
import { useProjectOne } from '@/Contexts/ProjectOne';

type ListWithActionsProps<T> = {
  loading?: boolean;
  data?: T[];
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  renderItem?: (item: T) => string;
  renderAvatar?: (item: T) => ReactNode;
  renderDescription?: (item: T) => ReactNode;
};

function ListWithActions<T = any>({
  loading,
  onDelete,
  renderDescription,
  renderAvatar,
  onEdit,
  data = [],
  renderItem = (item) => item as unknown as string
}: ListWithActionsProps<T>) {
  const { mutate } = useSWRConfig();
  const { internalPath } = useProjectOne();

  const onInternalDelete = useCallback(
    (item: T) => {
      Modal.confirm({
        title: 'Do you want to delete these item?',
        icon: <ExclamationCircleFilled />,
        content: 'This action can not be undone',
        okText: 'Confirm',
        cancelText: 'Cancel',
        okButtonProps: {
          danger: true
        },
        async onOk() {
          try {
            if (onDelete) {
              await onDelete(item);
              await mutate(internalPath);
            }
          } catch (e) {
            notification.error({
              message: `We couldn't perform this action`,
              description: formatErrorMessage(e)
            });
          }
        }
      });
    },
    [internalPath, mutate, onDelete]
  );

  const renderActions = useCallback(
    (item: T) => {
      const actions = [];

      if (onEdit) {
        actions.push(
          <Button
            key="list-edit"
            size="small"
            color="text-primary"
            onClick={() => onEdit(item)}
            bgColor="bg-primary-transparent-01"
            icon={<IconActions type="edit" />}
          />
        );
      }
      if (onDelete) {
        actions.push(
          <Button
            key="list-delete"
            size="small"
            color="text-error"
            bgColor="bg-error-transparent-01"
            icon={<IconActions type="delete" />}
            onClick={() => onInternalDelete(item)}
          />
        );
      }

      return actions;
    },
    [onDelete, onEdit, onInternalDelete]
  );

  return (
    <WrapperColor bgColor="semi-transparent">
      {!loading && !data.length ? (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      ) : (
        <List
          loading={loading}
          dataSource={data}
          itemLayout="horizontal"
          renderItem={(item) => {
            return (
              <List.Item actions={renderActions(item)}>
                <List.Item.Meta
                  title={renderItem(item)}
                  avatar={renderAvatar && renderAvatar(item)}
                  description={renderDescription && renderDescription(item)}
                />
              </List.Item>
            );
          }}
        />
      )}
    </WrapperColor>
  );
}

export default ListWithActions;
