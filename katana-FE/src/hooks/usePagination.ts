import { useCallback, useState } from 'react';

export default function usePagination({
  initialPage,
  initialLimit,
  minPage = 1
}:
  | {
      minPage?: number;
      initialPage?: number;
      initialLimit?: number;
    }
  | undefined = {}) {
  const [page, setPage] = useState(initialPage || 1);
  const [limit, setLimit] = useState(initialLimit || 10);

  const onNextPage = useCallback(() => {
    setPage((prev) => {
      return prev + 1;
    });
  }, []);

  const onPrevPage = useCallback(() => {
    setPage((prev) => {
      if (prev > minPage) return minPage;
      return prev - 1;
    });
  }, [minPage]);

  const onPageChange = useCallback((_page: number) => {
    setPage(_page);
  }, []);

  const onLimitChange = useCallback((_limit: number) => {
    setLimit(_limit);
  }, []);

  return {
    page,
    limit,
    onNextPage,
    onPrevPage,
    onPageChange,
    onLimitChange
  };
}
