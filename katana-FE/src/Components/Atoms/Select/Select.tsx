import { SelectProps as SelectAntdProps } from 'antd';
import { forwardRef, ReactNode } from 'react';
import type { BaseSelectRef } from 'rc-select/lib/BaseSelect';

import { reactChildrenText } from '@/utils';
import IconWrapper from '@/Components/Atoms/IconWrapper';
import classNames from 'classnames';
import { SelectAntdStyle } from './style';

export type SelectItemType = {
  value: string | number;
  label: ReactNode;
  icon?: ReactNode;
};

type SelectProps = BaseComponent & {
  items: SelectItemType[];
  placeholder?: string;
  allowClear?: boolean;
  value?: string | number | string[] | number[];
  defaultValue?: string | number | string[] | number[];
  withSearch?: boolean;
  multiple?: boolean;
  loading?: boolean;
  size?: SelectAntdProps['size'];
  onSelect?: (value: string, option: SelectItemType) => void;
  onChange?: (value: string, option: any) => void;
};

const Select = forwardRef<BaseSelectRef, SelectProps>(
  (
    {
      onSelect,
      onChange,
      size,
      items = [],
      loading,
      withSearch = false,
      multiple = false,
      className,
      placeholder = 'Select option',
      ...rest
    },
    _ref
  ) => {
    const onInternalSelect = (value: string, option?: any) => {
      const find = items.find((f) => f.value === value);
      onSelect && onSelect(value, { ...option, icon: find?.icon });
    };

    const filterOption = (inputValue: string, option: any) => {
      if (!inputValue) return true;
      const text = reactChildrenText(option?.label || option?.children);
      return text.toLowerCase().includes(inputValue.toLowerCase());
    };

    return (
      <SelectAntdStyle
        ref={_ref}
        size={size}
        loading={loading}
        mode={multiple ? 'multiple' : undefined}
        filterOption={filterOption}
        showSearch={withSearch}
        onSelect={onInternalSelect}
        onChange={onChange}
        placeholder={placeholder}
        optionFilterProp="label"
        className={classNames(className, {
          fullHeight: size === 'large'
        })}
        {...(rest as any)}
      >
        {items.map(({ value, label, icon }, index) => {
          return (
            <SelectAntdStyle.Option
              key={`item-${index}-${
                typeof value === 'string' ? value.charAt(0) : value
              }`}
              value={value}
            >
              <div className="flex items-center w-full">
                {icon ? (
                  <IconWrapper className="mr-2">{icon}</IconWrapper>
                ) : null}
                {label}
              </div>
            </SelectAntdStyle.Option>
          );
        })}
      </SelectAntdStyle>
    );
  }
);

Select.displayName = 'Select';

export default Select;
