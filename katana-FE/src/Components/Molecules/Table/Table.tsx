import { Table as AntdTable, TableProps as AntdTableProps } from 'antd';
import classnames from 'classnames';
import type { ColumnsType } from 'antd/es/table';

type TableProps<T = any> = BaseComponent &
  Omit<AntdTableProps<T>, 'columns'> & {
    columns: ColumnsType<any>;
    variant?: 'space' | 'default';
  };

const Table = ({
  columns,
  dataSource,
  className,
  variant = 'default',
  ...rest
}: TableProps) => {
  return (
    <div className="overflow-auto w-full flex">
      <AntdTable
        dataSource={dataSource}
        columns={columns as any}
        className={classnames(
          'shrink-0 sm:shrink sm:w-full',
          {
            'table-space': variant === 'space',
            'table-default': variant === 'default'
          },
          className
        )}
        {...rest}
      />
    </div>
  );
};

export default Table;
