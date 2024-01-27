import classNames from 'classnames';
import { BackgroundStyle } from './style';
import { PropsWithChildren } from 'react';

type BackgroundProps = {
  className?: string;
};
const BackgroundPage = ({
  children,
  className = ''
}: PropsWithChildren<BackgroundProps>) => {
  return (
    <div className="background-container">
      <BackgroundStyle
        className={classNames(['fixed top-0 left-0 w-screen h-screen z-0'])}
      />
      <div className={classNames('z-10 block relative', className)}>
        {children}
      </div>
    </div>
  );
};

export default BackgroundPage;
