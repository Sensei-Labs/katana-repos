import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useState } from 'react';
import { Skeleton } from 'antd';

import { fetcher } from '@/services/api';
import { API_ROUTES } from '@/config/api';
import { useProjectOne } from '@/Contexts/ProjectOne';
import {
  FilterEnum,
  FilterType,
  createDiscussionFilters
} from '@/fetches/forum';

import Header from './Components/Header';
import QuestionList, { QuestionType } from './Components/QuestionList';

const DiscussionTemplate = () => {
  const { mutate } = useSWRConfig();
  const { loading, treasury } = useProjectOne();
  const [filter, setFilter] = useState<FilterType | null>(null);

  const pathFetch = useMemo(() => {
    if (loading || !treasury?.id) return null;

    return API_ROUTES.PLURAL_QUESTION.path;
  }, [loading, treasury?.id]);

  const { data, isLoading } = useSWR<ResponseServer<QuestionType[]>>(
    pathFetch
      ? {
          url: pathFetch,
          params: {
            project: treasury?.id,
            ...createDiscussionFilters({ [FilterEnum.SORT]: filter?.sort }),
            filters: createDiscussionFilters({
              [FilterEnum.STATE]: filter?.state,
              [FilterEnum.SEARCH_TEXT]: filter?.title
            })
          }
        }
      : null,
    fetcher
  );

  const onRefresh = () => {
    return mutate(pathFetch);
  };

  const onClearFilters = () => {
    return setFilter(null);
  };

  const onSetFilters = (key: FilterEnum, value: string) => {
    return setFilter((prev) => {
      const beforeFilter = prev || {};
      if (!value) {
        delete beforeFilter[key];
        return beforeFilter;
      }
      return {
        ...beforeFilter,
        [key]: value
      };
    });
  };

  return (
    <div>
      <Header
        filters={filter}
        onFilter={onSetFilters}
        onClear={onClearFilters}
        onRefresh={onRefresh}
      />

      {!loading ? (
        <QuestionList loading={isLoading} data={data?.data || []} />
      ) : (
        <div className="mt-5">
          <Skeleton active />
        </div>
      )}
    </div>
  );
};
export default DiscussionTemplate;
