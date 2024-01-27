import { Layout } from 'antd';
import { PropsWithChildren } from 'react';
import classNames from 'classnames';

const Container = ({
  children,
  className,
  ...rest
}: PropsWithChildren<{ className?: string }>) => {
  return (
    <Layout.Content
      className={classNames(['px-5 md:px-12', className])}
      {...rest}
    >
      {children}
    </Layout.Content>
  );
};

export default Container;
