import classNames from 'classnames';
import { ReactNode } from 'react';
import { Skeleton } from 'antd';

type GridColumnProps = BaseComponent & {
  first: ReactNode;
  second: ReactNode;
  withMarginBottom?: boolean;
  loading?: boolean;
  align?: 'end' | 'center' | 'start';
  firstClassName?: string;
  secondClassName?: string;
};

const GridTwoColumn = ({
  className,
  first,
  second,
  secondClassName,
  firstClassName,
  align = 'end',
  loading,
  withMarginBottom = true,
  ...rest
}: GridColumnProps) => {
  if (loading) {
    return (
      <Skeleton.Input
        active
        block
        className={classNames({
          'mb-4': withMarginBottom
        })}
      />
    );
  }

  return (
    <div
      className={classNames(
        'flex justify-between',
        {
          'mb-4': withMarginBottom,
          'items-end': align === 'end',
          'items-start': align === 'start',
          'items-center': align === 'center'
        },
        className
      )}
      {...rest}
    >
      <div
        className={classNames(
          {
            'opacity-60': !firstClassName?.includes('opacity-')
          },
          'font-sans',
          firstClassName
        )}
      >
        {first}
      </div>
      <div className={classNames('font-sans', secondClassName)}>{second}</div>
    </div>
  );
};

export default GridTwoColumn;
