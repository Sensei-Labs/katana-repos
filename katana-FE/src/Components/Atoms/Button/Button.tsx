import { MouseEventHandler, ReactNode } from 'react';
import classNames from 'classnames';
import { Button as AntdButton, ButtonProps as ButtonPropsAntd } from 'antd';
import IconWrapper from '@/Components/Atoms/IconWrapper';
import {
  GenerateBgColor,
  GenerateBorderColor,
  GenerateFontColor
} from '@/styles/theme';

type VariantButton = 'semi-trans' | 'solid' | 'outline';

type ButtonProps = BaseComponent &
  ButtonPropsAntd & {
    icon?: ReactNode;
    variant?: VariantButton;
    color?: GenerateFontColor;
    bgColor?: GenerateBgColor;
    borderColor?: GenerateBorderColor;
    hasLoading?: boolean;
    isLoading?: boolean;
  };

const variants: { [k in VariantButton]: string | string[] } = {
  'semi-trans': ['bg-black-20 text-text dark:bg-white-10', 'hover:bg-white-20'],
  solid: 'hover:bg-opacity-75 active:bg-opacity-75',
  outline: 'is-transparent'
};

const Button = ({
  children,
  className,
  icon,
  type,
  disabled,
  variant = 'solid',
  color = 'font-white',
  bgColor = variant === 'semi-trans' ? '' : '',
  borderColor = 'border-transparent',
  hasLoading = false,
  isLoading = false,
  ...rest
}: ButtonProps) => {
  const classes = [
    'border border-solid transition',
    'shadow-none active:scale-95',
    icon && !children && 'p-0 px-2 text-xl leading-[0]',
    icon && 'flex items-center',
    bgColor,
    color,
    borderColor,
    variants[variant],
    className
  ];

  if (hasLoading && isLoading) {
    return (
      <AntdButton
        className={classNames(classes)}
        type="primary"
        style={{ display: 'flex', backgroundColor: '#51808F' }}
        disabled={disabled}
        {...rest}
        loading
      >
        {children}
      </AntdButton>
    );
  }

  return (
    <AntdButton
      className={classNames(classes)}
      type="primary"
      disabled={disabled}
      style={hasLoading ? { display: 'flex' } : {}}
      {...rest}
    >
      {icon && (
        <IconWrapper
          style={{ lineHeight: 0 }}
          className={classNames({
            'mr-2': !!children,
            'pointer-events-none': disabled
          })}
        >
          {icon}
        </IconWrapper>
      )}
      {children}
    </AntdButton>
  );
};
Button.displayName = 'Button';

export default Button;
