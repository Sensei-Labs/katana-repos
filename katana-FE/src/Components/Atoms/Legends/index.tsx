import { formatMoney } from '@/utils/generalFormat';
import { Space } from 'antd';

export default function LegendDonut({
  label,
  index,
  color,
  value,
  isDisabled,
  onClick
}: {
  label: string;
  index: number;
  value: number;
  isDisabled: boolean;
  color: string;
  onClick: (index: number) => void;
}) {
  // const backgroundColor = getOpacityColor(color, 0.2);

  return (
    <div
      onClick={() => onClick(index)}
      className="relative py-1 px-1 rounded cursor-pointer"
    >
      <Space align="start">
        <div
          style={{ backgroundColor: color }}
          className="w-3 h-3 rounded-full mt-1"
        />
        <div>
          <div className="text-sm text-secondaryText2">{label}</div>
          <div
            className={`font-bold ${isDisabled ? 'text-secondaryText2' : ''}`}
          >
            ${formatMoney(value)}
          </div>
        </div>
      </Space>
      {isDisabled && (
        <div className="block absolute top-[-15px] bottom-0 my-auto left-0 w-full h-[1px] bg-dark dark:bg-white" />
      )}
    </div>
  );
}
