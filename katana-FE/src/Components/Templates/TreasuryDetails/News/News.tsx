import useSWR, { useSWRConfig } from 'swr';
import { useMemo, useState } from 'react';

import { fetcher } from '@/services/api';
import useToggle from '@/hooks/useToggle';
import { deleteNews, getAllNews } from '@/fetches/news';
import Title from '@/Components/Atoms/Title';
import Button from '@/Components/Atoms/Button';
import NewList from '@/Components/Organisms/NewList';
import { useProjectOne } from '@/Contexts/ProjectOne';
import IconActions from '@/Components/Atoms/IconActions';
import { NewItemProps } from '@/Components/Organisms/NewList/NewList';
import ModalCreateNew from '@/Components/Molecules/ModalCreateNew';
import usePagination from '@/hooks/usePagination';
import ModalViewNew from '@/Components/Molecules/ModalViewNew';
import ModalEditNew from '@/Components/Molecules/ModalEditNew';
import { notification } from 'antd';
import { formatErrorMessage } from '@/utils/formatError';

export default function News() {
  const { mutate } = useSWRConfig();
  const { treasury } = useProjectOne();
  const [isOpenAdd, toggleOpenAdd] = useToggle();
  const [isOpenView, toggleOpenView] = useToggle();
  const [isOpenEdit, toggleOpenEdit] = useToggle();
  const [view, setView] = useState<NewItemProps | null>(null);

  const { page, limit, onPageChange } = usePagination();

  const resolvePath = useMemo(() => {
    return getAllNews(treasury?.id, { limit, page });
  }, [treasury?.id, limit, page]);

  const { data, isLoading } = useSWR<ResponseServer<NewItemProps[]>>(
    resolvePath,
    fetcher
  );

  const onCompletedSuccess = () => {
    return mutate(resolvePath);
  };

  const onDeleteNews = async (id: number) => {
    try {
      await deleteNews(id);
      return mutate(resolvePath);
    } catch (e) {
      console.log(e);
      console.log(e);
      notification.error({
        message: 'Error delete a news',
        description: formatErrorMessage(e)
      });
    }
  };

  return (
    <div className="mt-5">
      <div className="flex justify-between">
        <Title level="h1" fontSize="2.5rem">
          News
        </Title>
        <Button onClick={toggleOpenAdd} icon={<IconActions type="add" />}>
          <span>Add</span>
        </Button>
      </div>

      <NewList
        loading={isLoading}
        dataSource={data?.data || []}
        onClickItem={(item) => {
          setView(item);
          toggleOpenView();
        }}
        pagination={{
          current: page,
          pageSize: limit,
          onChange: onPageChange,
          total: data?.meta?.pagination?.total || 0
        }}
      />

      <ModalCreateNew
        onCompletedSuccess={onCompletedSuccess}
        isOpen={isOpenAdd}
        onClose={toggleOpenAdd}
      />

      {view && (
        <ModalViewNew
          id={view.id}
          title={view.title}
          isOpen={isOpenView}
          onDelete={onDeleteNews}
          content={view.content}
          onEdit={toggleOpenEdit}
          onClose={toggleOpenView}
        />
      )}

      {view && (
        <ModalEditNew
          itemData={view}
          isOpen={isOpenEdit}
          onClose={toggleOpenEdit}
          onCompletedSuccess={onCompletedSuccess}
        />
      )}
    </div>
  );
}
