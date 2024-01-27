import useSWR from 'swr';
import { useRouter } from 'next/router';
import { createContext, PropsWithChildren, useContext, useMemo } from 'react';

import { validateArray } from '@/utils';
import { fetcher } from '@/services/api';
import { API_ROUTES } from '@/config/api';
import { useScope } from '@/Contexts/Scope';
import resolveUrl from '@/utils/resolveUrl';
import { TreasuryType } from '@/Contexts/Projects/Treasuries';

import { ProjectInfoType } from '../../Projects/types';

const defaultValues: ProjectInfoType = {
  treasury: null,
  isLoading: false,
  firstLoading: true,
  error: null,
  internalPath: '',
  scopeTreasury: {
    canBeRead: false,
    isCreator: false,
    canBeWrite: false
  }
};

const ProjectInfoContext = createContext<ProjectInfoType>(defaultValues);

const getPath = (address = '') => {
  const basePath = resolveUrl(
    API_ROUTES.GET_TREASURY_BY_ID.path,
    API_ROUTES.GET_TREASURY_BY_ID.params.ID,
    address
  );

  return `${basePath}?populate[0]=thumbnail&populate[1]=milestones&populate[2]=milestones.tasks&populate[3]=tags&populate[4]=frontPage&populate[5]=treasuryAddresses&populate[6]=collection_nfts_addresses&filters[status][$eq]=active`;
};

export const ProjectInfoProvider = ({ children }: PropsWithChildren) => {
  const { query } = useRouter();
  const { getScopeForProject } = useScope();

  // Fetchers
  const { data, isLoading, error } = useSWR<ResponseServer<TreasuryType>>(
    getPath(query?.address as string),
    fetcher,
    {
      refreshWhenHidden: false,
      revalidateOnFocus: false,
      refreshInterval: 1000 * 60
    }
  );

  const dataCache = useMemo<TreasuryType | null>(() => {
    const dataResponse = data?.data;
    if (dataResponse) {
      return {
        ...dataResponse,
        collectionCount: dataResponse?.collection_nfts_addresses?.length || 0,
        acceptedCollectionAddress: validateArray(
          dataResponse?.acceptedCollectionAddress
        ),
        moreLinks: validateArray(dataResponse?.moreLinks)
      };
    }
    return null;
  }, [data?.data]);

  const scopeTreasury = useMemo(() => {
    if (!dataCache) {
      return {
        isCreator: false,
        canBeWrite: false,
        canBeRead: false
      };
    }
    return getScopeForProject(dataCache.id);
  }, [getScopeForProject, dataCache]);

  return (
    <ProjectInfoContext.Provider
      value={{
        error,
        scopeTreasury,
        internalPath: getPath(query?.address as string),
        treasury: dataCache,
        firstLoading: isLoading || !dataCache,
        isLoading: isLoading
      }}
    >
      {children}
    </ProjectInfoContext.Provider>
  );
};

export const useProjectInfo = () => useContext(ProjectInfoContext);
