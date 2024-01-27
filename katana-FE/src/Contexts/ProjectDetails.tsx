import { PropsWithChildren } from 'react';

import { TransactionsProvider } from '@/Contexts/Transactions';
import { ProjectOneProvider } from '@/Contexts/ProjectOne';
import { StatisticProvider } from '@/Contexts/Statistic';

export default function ProjectDetailsProvider({
  children
}: PropsWithChildren) {
  return (
    <ProjectOneProvider>
      <TransactionsProvider>
        <StatisticProvider>{children}</StatisticProvider>
      </TransactionsProvider>
    </ProjectOneProvider>
  );
}
