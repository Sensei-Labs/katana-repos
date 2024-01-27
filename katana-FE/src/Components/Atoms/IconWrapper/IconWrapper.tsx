import { cloneElement, ReactNode } from 'react';
import classNames from 'classnames';

type IconWrapperProps = BaseComponent & {
  children?: ReactNode;
};

const IconWrapper = ({ children, className, ...rest }: IconWrapperProps) => {
  return (
    <span
      className={classNames('text-[18px] iconly flex items-center', className)}
      {...rest}
    >
      {cloneElement(children as JSX.Element, {
        className: classNames(
          'w-[1em] h-[1em]',
          (children as any)?.props?.className
        )
      })}
    </span>
  );
};

export default IconWrapper;
