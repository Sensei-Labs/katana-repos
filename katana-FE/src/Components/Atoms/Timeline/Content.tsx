import Text from '@/Components/Atoms/Text';
import { Dropdown, MenuProps, Space, Spin } from 'antd';
import { useCallback, useMemo } from 'react';

import Chip from '@/Components/Atoms/Chip';
import Button from '@/Components/Atoms/Button';
import useTraceSync from '@/hooks/useTraceSync';
import IconActions from '@/Components/Atoms/IconActions';
import { ScopeType } from '@/hooks/useRedirectTreasuryAccess';
import PermissionSection from '@/Components/Atoms/PermissionSection';

import { ContentStyle } from './style';

interface ContentTimelineProps {
  title: string;
  description: string;
  date: string;
  completed: boolean;
  isActive?: boolean;
  onChangeState: (completed: boolean) => Promise<void>;
  onClick?: () => void;
  onDelete?: () => void;
}

export default function Content({
  title,
  isActive,
  date,
  completed,
  description,
  onClick,
  onDelete,
  onChangeState
}: ContentTimelineProps) {
  const [loading, onTrace] = useTraceSync();

  const onClickState = useCallback(
    async (_completed: boolean) => {
      await onTrace(() => onChangeState(_completed));
    },
    [onChangeState, onTrace]
  );

  const items = useMemo(() => {
    const output: MenuProps['items'] = [];

    if (!completed) {
      output.push({
        key: 'true',
        label: 'Completed',
        onClick: () => onClickState(true)
      });
    } else {
      output.push({
        key: 'false',
        label: 'Not Completed',
        onClick: () => onClickState(false)
      });
    }

    return output;
  }, [completed, onClickState]);

  return (
    <ContentStyle
      $isActive={isActive}
      onClick={onClick}
      className="p-5 rounded-2xl"
    >
      <div className="mb-3">
        <Text className="text-left" fontSize={20}>
          {title}
        </Text>

        <PermissionSection
          fallback={
            <Chip type={completed ? 'success' : 'error'}>
              {completed ? 'Completed' : 'Not Completed'}
            </Chip>
          }
          scope={[ScopeType.IS_CREATOR, ScopeType.CAN_BE_WRITE]}
        >
          <div className="flex" onClick={(e) => e?.stopPropagation()}>
            {loading ? (
              <Spin size="small" className="text-white" />
            ) : (
              <Space className="w-full justify-between">
                <Dropdown
                  disabled={loading}
                  menu={{
                    items
                  }}
                >
                  <Chip type={completed ? 'success' : 'error'}>
                    {completed ? 'Completed' : 'Not Completed'}
                  </Chip>
                </Dropdown>

                <Button
                  color="text-error"
                  onClick={onDelete}
                  bgColor="bg-transparent"
                  icon={<IconActions size="small" type="delete" />}
                />
              </Space>
            )}
          </div>
        </PermissionSection>
      </div>
      <Text className="text-left" color="text-secondaryText2" withMargin>
        {date}
      </Text>
      <Text className="text-left" color="text-secondaryText3">
        {description}
      </Text>
    </ContentStyle>
  );
}
