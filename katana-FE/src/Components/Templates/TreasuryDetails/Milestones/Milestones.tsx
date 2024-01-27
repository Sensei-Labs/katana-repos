import { useMemo, useState } from 'react';
import BigNumber from 'bignumber.js';
import { useTheme } from 'styled-components';
import { App, Col, Modal, notification, Progress, Row, Space } from 'antd';

import useToggle from '@/hooks/useToggle';
import Title from '@/Components/Atoms/Title';
import Button from '@/Components/Atoms/Button';
import useTraceSync from '@/hooks/useTraceSync';
import {
  changeStateToTask,
  deleteMilestone,
  deleteTask
} from '@/fetches/milestone';
import { StateTask, TaskType } from '@/types/milestone';
import IconActions from '@/Components/Atoms/IconActions';
import { ScopeType } from '@/hooks/useRedirectTreasuryAccess';
import MilestoneTasks from '@/Components/Organisms/MilestoneTasks';
import { useProjectOne } from '@/Contexts/ProjectOne';
import PermissionSection from '@/Components/Atoms/PermissionSection';
import MilestoneRoadMap from '@/Components/Organisms/MilestoneRoadMap';
import ModalAddMilestone from '@/Components/Molecules/ModalAddMilestone';
import ModalAddTaskToMilestone from '@/Components/Molecules/ModalAddTaskToMilestone';
import { useSWRConfig } from 'swr';

const MilliStoneTemplate = () => {
  const theme = useTheme();

  const { mutate } = useSWRConfig();
  const { treasury, internalPath } = useProjectOne();
  const [loadingEdit, toggleEdit] = useTraceSync();
  const [visibleMilestone, toggleVisibleMilestone] = useToggle();
  const [visibleTask, toggleVisibleTask] = useToggle();

  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(
    null
  );

  const tasks = useMemo(() => {
    if (!treasury?.milestones) return [];
    const output: TaskType[] = [];

    treasury?.milestones?.forEach(({ tasks, id }) => {
      if (selectedMilestone) {
        if (selectedMilestone === id) {
          output.push(...tasks);
        }
      } else {
        output.push(...tasks);
      }
    }, []);

    return output;
  }, [treasury?.milestones, selectedMilestone]);

  const percentage = useMemo(() => {
    const length = treasury?.milestones?.length || 0;
    const completedItems =
      treasury?.milestones?.filter((item) => item.completed) || [];

    return new BigNumber(
      ((100 / length) * completedItems.length).toFixed(2)
    ).toNumber();
  }, [treasury?.milestones]);

  const percentageForSelectedTask = useMemo(() => {
    const length = tasks.length;
    const completedItems =
      tasks.filter((item) => item.state === StateTask.COMPLETED) || [];

    return new BigNumber(
      ((100 / length) * completedItems.length).toFixed(2)
    ).toNumber();
  }, [tasks]);

  const onChangeStateTask = async (id: number, state: StateTask) => {
    try {
      await toggleEdit(() => changeStateToTask(id, state));
      await mutate(internalPath);
    } catch (e) {
      console.log(e);
      notification.error({
        message: 'Oops!',
        description:
          'It seems that we have not been able to perform this action'
      });
    }
  };

  const onDeleteTask = (id: number) => {
    const action = async () => {
      try {
        await toggleEdit(() => deleteTask(id));
        await mutate(internalPath);
      } catch (e) {
        console.log(e);
        notification.error({
          message: 'Oops!',
          description:
            'It seems that we have not been able to perform this action'
        });
      }
    };

    return Modal.confirm({
      okType: 'danger',
      title: 'Confirm this Action',
      content: 'Are you sure you want to delete this Task?',
      onOk: action
    });
  };

  const onDeleteMilestone = (id: number) => {
    const action = async () => {
      try {
        await toggleEdit(() => deleteMilestone(id));
        await mutate(internalPath);
      } catch (e) {
        console.log(e);
        notification.error({
          message: 'Oops!',
          description:
            'It seems that we have not been able to perform this action'
        });
      }
    };

    return Modal.confirm({
      okType: 'danger',
      title: 'Confirm this Action',
      content: 'Are you sure you want to delete this Milestone?',
      onOk: action
    });
  };

  const onSelectedMilestone = (id: number) => {
    setSelectedMilestone((prev) => {
      if (id === prev) return null;
      return id;
    });
  };

  return (
    <div>
      <Row gutter={[20, 20]}>
        <Col xs={24} md={10} lg={11}>
          <Space size="large" wrap className="mb-5">
            <Title
              fontSize="3rem"
              withMargin={false}
              lineHeight="3.5rem"
              fontFamily="font-sans"
            >
              Milestone
            </Title>

            <PermissionSection
              scope={[ScopeType.CAN_BE_WRITE, ScopeType.IS_CREATOR]}
            >
              <Button
                variant="semi-trans"
                onClick={toggleVisibleMilestone}
                icon={<IconActions type="add" />}
              >
                Add new Milestone
              </Button>
            </PermissionSection>
          </Space>

          <Title
            className="mt-5"
            fontSize="2rem"
            lineHeight="2.5rem"
            fontFamily="font-sans"
          >
            Progress
          </Title>
          <Progress
            // @ts-ignore
            size={['100%', 35]}
            percent={selectedMilestone ? percentageForSelectedTask : percentage}
            strokeColor={theme.colors.success}
          />

          <MilestoneTasks
            tasks={tasks}
            loading={loadingEdit}
            onDeleteTask={onDeleteTask}
            createTask={toggleVisibleTask}
            onChangeStateTask={onChangeStateTask}
          />
        </Col>

        <Col xs={0} md={2} lg={3} />

        <Col xs={24} md={12} lg={10}>
          <MilestoneRoadMap
            onSelected={onSelectedMilestone}
            onDeleteMilestone={onDeleteMilestone}
            selectedMilestone={selectedMilestone}
            milestones={treasury?.milestones || []}
          />
        </Col>
      </Row>

      <ModalAddMilestone
        visible={visibleMilestone}
        onClose={toggleVisibleMilestone}
      />
      <ModalAddTaskToMilestone
        visible={visibleTask}
        onClose={toggleVisibleTask}
      />
    </div>
  );
};

export default MilliStoneTemplate;
