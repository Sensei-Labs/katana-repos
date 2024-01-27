import { MouseEvent, PropsWithChildren } from 'react';
import { type StatusBadge, BadgeStyle } from './style';

type ChipProps = BaseComponent & {
  type: StatusBadge;
  onClick?: (e: MouseEvent<HTMLDivElement>) => void;
};

const Chip = ({ type, children, ...rest }: PropsWithChildren<ChipProps>) => {
  return (
    <BadgeStyle {...rest} $type={type}>
      {children}
    </BadgeStyle>
  );
};

export default Chip;
