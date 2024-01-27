export enum StateTask {
  NOT_STARTED = 'Not_started',
  STARTED = 'Started',
  COMPLETED = 'Completed'
}

export const StateTaskOptions = [
  {
    label: 'Not started',
    value: StateTask.NOT_STARTED
  },
  {
    label: 'Started',
    value: StateTask.STARTED
  },
  {
    label: 'Completed',
    value: StateTask.COMPLETED
  }
];

export type TaskType = {
  id: number;
  title: string;
  description: string;
  state: StateTask;
  by: string;
};

export type MilestoneType = {
  id: number;
  title: string;
  description: string;
  date: string;
  completed: boolean;
  tasks: TaskType[];
};
