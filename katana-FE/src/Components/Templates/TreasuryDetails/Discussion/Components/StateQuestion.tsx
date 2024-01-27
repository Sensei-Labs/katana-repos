import { Tag } from 'antd';

export enum StateQuestionEnum {
  NEW = 'new',
  OPEN = 'open',
  CLOSED = 'closed'
}

function resolveLabel(state: StateQuestionEnum) {
  const labelsMap = {
    [StateQuestionEnum.NEW]: 'New',
    [StateQuestionEnum.OPEN]: 'Open',
    [StateQuestionEnum.CLOSED]: 'Closed'
  } as const;

  return labelsMap[state] || labelsMap[StateQuestionEnum.NEW];
}

function resolveColor(state: StateQuestionEnum) {
  const colorsMap = {
    [StateQuestionEnum.NEW]: 'purple',
    [StateQuestionEnum.OPEN]: 'green',
    [StateQuestionEnum.CLOSED]: 'blue'
  } as const;

  return colorsMap[state] || colorsMap[StateQuestionEnum.NEW];
}

export default function StateQuestion({ state }: { state: StateQuestionEnum }) {
  return (
    <Tag color={resolveColor(state)} style={{ width: 60, textAlign: 'center' }}>
      {resolveLabel(state)}
    </Tag>
  );
}
