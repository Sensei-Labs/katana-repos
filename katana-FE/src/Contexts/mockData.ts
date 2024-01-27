import Mock from '@/utils/Mock';

export const data = {
  labels: [
    'Jan',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic'
  ],
  data: [
    {
      name: 'Marketing',
      values: Mock.getRandomArray(12)
    },
    {
      name: 'Expenses',
      values: Mock.getRandomArray(12)
    }
  ]
};

export const dataPie = {
  name: 'Team',
  labels: ['Team', 'Marketing', 'Development', 'Services'],
  values: [12, 19, 3, 5, 2, 3]
};
