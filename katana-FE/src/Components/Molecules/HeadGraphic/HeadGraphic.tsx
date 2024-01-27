import { Segmented, SegmentedProps, Space, Switch } from 'antd';
import { TIME_FILTER_STATISTIC } from '@/Contexts/Statistic';
import classNames from 'classnames';
import Text from '@/Components/Atoms/Text';

type TimelineGraphicProps = BaseComponent & {
  loading: boolean;
  activeRoyalty: boolean;
  type: 'pie' | 'line';
  timeFilter: TIME_FILTER_STATISTIC;
  options: SegmentedProps['options'];
  onShowRoyalties(type: 'pie' | 'line'): void;
  onChangeTimeFilter(time: TIME_FILTER_STATISTIC, type: 'pie' | 'line'): void;
};

const HeadGraphic = ({
  onChangeTimeFilter,
  loading,
  options,
  className,
  activeRoyalty,
  onShowRoyalties,
  type,
  timeFilter,
  ...props
}: TimelineGraphicProps) => {
  return (
    <div
      className={classNames(['flex justify-between align-center', className])}
      {...props}
    >
      <Space direction="vertical" align="center">
        <Switch
          size="small"
          checked={activeRoyalty}
          onChange={() => onShowRoyalties(type)}
        />
        <Text fontSize="12px" lineHeight="14px" color="text-secondaryText2">
          Royalties
        </Text>
      </Space>
      <Segmented
        options={options}
        disabled={loading}
        className="h-fit"
        defaultValue={timeFilter}
        onChange={(time) =>
          onChangeTimeFilter(time as TIME_FILTER_STATISTIC, type)
        }
      />
    </div>
  );
};

export const optionsForLine = [
  { label: 'Day', value: TIME_FILTER_STATISTIC.ONE_DAY },
  { label: 'Week', value: TIME_FILTER_STATISTIC.ONE_WEEK },
  {
    label: 'Month',
    value: TIME_FILTER_STATISTIC.ONE_MONTH
  },
  {
    label: 'Year',
    value: TIME_FILTER_STATISTIC.ONE_YEAR
  }
];

export const optionsForPie = [
  { label: 'Day', value: TIME_FILTER_STATISTIC.ONE_DAY },
  { label: 'Week', value: TIME_FILTER_STATISTIC.ONE_WEEK },
  {
    label: 'Month',
    value: TIME_FILTER_STATISTIC.ONE_MONTH
  },
  {
    label: 'Year',
    value: TIME_FILTER_STATISTIC.ONE_YEAR
  },
  {
    label: 'Max',
    value: TIME_FILTER_STATISTIC.MAX
  }
];

export default HeadGraphic;
