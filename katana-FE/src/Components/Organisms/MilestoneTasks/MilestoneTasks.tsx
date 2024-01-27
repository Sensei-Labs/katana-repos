import { Collapse, Dropdown, Space, Spin } from 'antd';

import Text from '@/Components/Atoms/Text';
import Title from '@/Components/Atoms/Title';
import Button from '@/Components/Atoms/Button';
import Tooltip from '@/Components/Atoms/Tooltip';
import IconActions from '@/Components/Atoms/IconActions';
import Chip, { StatusBadge } from '@/Components/Atoms/Chip';
import { ScopeType } from '@/hooks/useRedirectTreasuryAccess';
import PermissionSection from '@/Components/Atoms/PermissionSection';
import { StateTask, StateTaskOptions, TaskType } from '@/types/milestone';

type MilestoneTasksProps = {
  tasks: TaskType[];
  loading?: boolean;
  createTask?(): void;
  onChangeStateTask?(id: number, state: StateTask): void;
  onDeleteTask?(id: number): void;
};

const mabStateTask = {
  [StateTask.COMPLETED]: 'success',
  [StateTask.STARTED]: 'warning',
  [StateTask.NOT_STARTED]: 'error'
};

const MilestoneTasks = ({
  loading,
  createTask,
  onChangeStateTask,
  onDeleteTask,
  tasks = []
}: MilestoneTasksProps) => {
  return (
    <div>
      <Space className="mt-5" align="center">
        <Title fontSize="2rem" lineHeight="2.5rem" fontFamily="font-sans">
          Tasks
        </Title>

        <PermissionSection
          scope={[ScopeType.CAN_BE_WRITE, ScopeType.IS_CREATOR]}
        >
          <Button
            size="small"
            variant="semi-trans"
            onClick={createTask}
            icon={<IconActions size="small" type="add" />}
          />
        </PermissionSection>

        {loading && <Spin className="text-white" />}
      </Space>

      <Collapse accordion>
        {tasks.map(({ id, title, description, by, state }) => (
          <Collapse.Panel
            key={id}
            header={title}
            extra={
              <PermissionSection
                scope={[ScopeType.CAN_BE_WRITE, ScopeType.IS_CREATOR]}
                fallback={
                  <Chip type={mabStateTask[state] as StatusBadge}>{state}</Chip>
                }
              >
                <Space>
                  <Dropdown
                    trigger={['click']}
                    disabled={loading}
                    menu={{
                      items: StateTaskOptions.filter(
                        ({ value }) => value !== state
                      ).map(({ label, value }) => ({
                        label,
                        key: value,
                        onClick: () => {
                          if (onChangeStateTask) {
                            onChangeStateTask(id, value);
                          }
                        }
                      }))
                    }}
                  >
                    <Chip
                      type={mabStateTask[state] as StatusBadge}
                      onClick={(e) => e?.stopPropagation()}
                    >
                      {state}
                    </Chip>
                  </Dropdown>

                  <Button
                    color="text-error"
                    bgColor="bg-transparent"
                    onClick={() => onDeleteTask && onDeleteTask(id)}
                    icon={<IconActions size="small" type="delete" />}
                  />
                </Space>
              </PermissionSection>
            }
          >
            <Text withMargin>{description}</Text>

            <Text color="text-secondaryText3">
              <span className="text-white">By</span>:{' '}
              <Tooltip text={by}>
                <span>{by?.slice(0, 15)}...</span>
              </Tooltip>
            </Text>
          </Collapse.Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default MilestoneTasks;
