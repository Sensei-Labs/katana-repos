import { Select } from 'antd';
import { useMemo } from 'react';
import useInmutableSWR from 'swr/immutable';

import { API_ROUTES } from '@/config/api';
import { fetcher } from '@/services/api';

const SelectTagProject = (props: Record<string, any>) => {
  const { data, isLoading } = useInmutableSWR<
    ResponseServer<{ name: string; id: number }[]>
  >(API_ROUTES.GET_TREASURY_TAGS.path, fetcher);

  const options = useMemo(() => {
    if (!data?.data?.length) return [];
    return data.data.map((item) => ({ label: item.name, value: item.id }));
  }, [data]);

  return (
    <Select mode="multiple" {...props} loading={isLoading} options={options} />
  );
};

export default SelectTagProject;
