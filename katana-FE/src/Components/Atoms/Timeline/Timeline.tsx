import { useMemo } from 'react';
import { StepsProps } from 'antd';
import Content from '@/Components/Atoms/Timeline/Content';

import { TimeLineStyle } from './style';

type TimeLineProps = Omit<StepsProps, 'items'> & {
  items: {
    key: string | number;
    title: string;
    date: string;
    completed: boolean;
    isActive?: boolean;
    description: string;
    onClick?: () => void;
    onDelete?: () => void;
    onChangeState: (completed: boolean) => Promise<any>;
  }[];
};

const Timeline = ({ items = [], ...props }: TimeLineProps) => {
  const resolveItems = useMemo<StepsProps['items']>(() => {
    return items.map((item) => {
      return {
        key: item.key,
        status: (item.completed ? 'finish' : 'wait ') as StepsProps['status'],
        description: (
          <Content
            date={item.date}
            title={item.title}
            onClick={item.onClick}
            onDelete={item?.onDelete}
            isActive={item.isActive}
            completed={item.completed}
            onChangeState={item.onChangeState}
            description={item.description}
          />
        )
      };
    });
  }, [items]);

  return <TimeLineStyle direction="vertical" items={resolveItems} {...props} />;
};

export default Timeline;
