import Text from '@/Components/Atoms/Text';

type TooltipContentProps = {
  name: string;
  description: string;
  floor?: string;
  totalFloor?: string;
};

const TooltipContent = ({
  name,
  description,
  floor,
  totalFloor
}: TooltipContentProps) => {
  return (
    <div className="block w-full">
      <Text withMargin weight="bold" color="text-white" fontSize={25}>
        {name}
      </Text>
      <Text withMargin color="text-white">
        {description}
      </Text>

      <div className="block">
        {floor && (
          <Text withMargin={false} weight="bold" color="text-brand">
            Floor: <span className="text-white">{floor}</span>
          </Text>
        )}
        {totalFloor && (
          <Text withMargin={false} weight="bold" color="text-brand">
            Total floor: <span className="text-white">{totalFloor}</span>
          </Text>
        )}
      </div>
    </div>
  );
};

export default TooltipContent;
