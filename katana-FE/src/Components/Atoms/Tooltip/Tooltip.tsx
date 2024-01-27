import { Tooltip as AntdTooltip, TooltipProps } from 'antd';
import { ReactNode } from 'react';
import classNames from 'classnames';
import { TooltipContainer } from '@/Components/Atoms/Tooltip/style';

type TooltipPropsType = TooltipProps & {
  text?: ReactNode;
  className?: string;
};

const Tooltip = ({
  children,
  text,
  className,
  showArrow = false,
  placement = 'bottom',
  ...rest
}: TooltipPropsType) => {
  return (
    <AntdTooltip
      {...rest}
      className={className}
      showArrow={showArrow}
      placement={placement}
      overlay={<TooltipContainer>{text}</TooltipContainer>}
    >
      {children}
    </AntdTooltip>
  );
};

export default Tooltip;
