import { PropsWithChildren } from 'react';
import { ProjectInfoProvider } from '@/Contexts/ProjectOne/subContext/ProjectInfo';
import { ProjectSPLTokensProvider } from '@/Contexts/ProjectOne/subContext/ProjectSPLTokens';
import { ProjectCollectionsInfoProvider } from '@/Contexts/ProjectOne/subContext/ProjectCollectionsInfo';
import { TreasuryOneProvider } from '@/Contexts/ProjectOne/ProjectOne';

export function ProjectOneProvider({ children }: PropsWithChildren) {
  return (
    <ProjectInfoProvider>
      <ProjectCollectionsInfoProvider>
        <ProjectSPLTokensProvider>
          <TreasuryOneProvider>{children}</TreasuryOneProvider>
        </ProjectSPLTokensProvider>
      </ProjectCollectionsInfoProvider>
    </ProjectInfoProvider>
  );
}

export { useProjectOne } from './ProjectOne';
