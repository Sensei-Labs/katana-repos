import { BadgeStyle } from './style';
import { PropsWithChildren } from 'react';

export default function BadgeDot({
  countBadge,
  showDot,
  children,
  ...rest
}: PropsWithChildren<{
  showDot?: boolean;
  countBadge?: number;
}>) {
  return (
    <BadgeStyle
      size="small"
      dot={showDot}
      count={countBadge}
      className="text-white"
      {...rest}
    >
      {children}
    </BadgeStyle>
  );
}
