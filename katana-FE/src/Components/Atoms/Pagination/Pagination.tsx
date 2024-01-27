import { Pagination as RCPagination } from 'antd';

type PaginationProps = BaseComponent & {
  onChange?: (page: number) => void;
  current: number;
  total: number;
  disabled?: boolean;
};

const Pagination = ({
  total,
  current,
  onChange,
  ...props
}: PaginationProps) => {
  return (
    <RCPagination
      total={total}
      current={current}
      onChange={onChange}
      {...props}
    />
  );
};

export default Pagination;
