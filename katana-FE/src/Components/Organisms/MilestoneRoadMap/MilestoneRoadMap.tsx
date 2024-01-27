import Title from '@/Components/Atoms/Title';
import Timeline from '@/Components/Atoms/Timeline';
import { MilestoneType } from '@/types/milestone';
import { updateStateMilestone } from '@/fetches/milestone';
import { useProjectOne } from '@/Contexts/ProjectOne';
import { useSWRConfig } from 'swr';

type RoadMapProps = {
  milestones: MilestoneType[];
  selectedMilestone: number | null;
  onSelected(id: number): void;
  onDeleteMilestone(id: number): void;
};

const MilestoneRoadMap = ({
  onSelected,
  selectedMilestone,
  onDeleteMilestone,
  milestones = []
}: RoadMapProps) => {
  const { internalPath } = useProjectOne();
  const { mutate } = useSWRConfig();

  const onChangeState = (milestonesId: number) => {
    return async (completed: boolean) => {
      await updateStateMilestone(milestonesId, { completed });
      return mutate(internalPath);
    };
  };

  return (
    <div>
      <Title fontSize="2rem" lineHeight="2.5rem" fontFamily="font-sans">
        Road Map
      </Title>

      <Timeline
        items={
          milestones.map((item) => ({
            key: item.id,
            title: item.title,
            completed: item.completed,
            isActive: selectedMilestone === item.id,
            onClick: () => onSelected(item.id),
            onDelete: () => onDeleteMilestone(item.id),
            date: new Date(item.date).toDateString(),
            description: item.description,
            onChangeState: onChangeState(item.id)
          })) || []
        }
      />
    </div>
  );
};

export default MilestoneRoadMap;
