import { useMemo, useState } from 'react';
import { Badge, DatePicker, Drawer, Input, List } from 'antd';
import { Filter2, CloseSquare, TickSquare } from 'react-iconly';

import useToggle from '@/hooks/useToggle';
import Button from '@/Components/Atoms/Button';
import Select, { SelectItemType } from '@/Components/Atoms/Select/Select';
import dayjs from 'dayjs';

export type SettingsType = 'select' | 'input' | 'datePicker';

export type SettingsProps = {
  type: SettingsType;
  mode?: 'multiple';
  label: string;
  field: string;
  defaultValue?: string;
  isLoading?: boolean;
  options?: SelectItemType[];
};

export type FilterDrawerProps<T> = BaseComponent & {
  onApplyFilter: (filter: T) => void;
  settings: SettingsProps[];
  loading?: boolean;
};

const resolveFilterComponent = (
  setting: SettingsProps,
  {
    value,
    isLoading,
    onChange
  }: {
    value?: string | number;
    isLoading?: boolean;
    onChange: (field: string, value: string | number) => void;
  }
): JSX.Element => {
  let component = (
    <Input
      allowClear
      size="middle"
      value={value}
      key={setting.field}
      onChange={(e) => {
        onChange(setting.field, e.target.value);
      }}
    />
  );

  if (setting.type === 'select') {
    component = (
      <Select
        allowClear
        value={value}
        className="block"
        loading={isLoading}
        multiple={setting.mode === 'multiple'}
        key={setting.field}
        items={setting.options || []}
        onChange={(v) => onChange(setting.field, v)}
      />
    );
  }

  if (setting.type === 'datePicker') {
    component = (
      <DatePicker
        allowClear
        className="block"
        key={setting.field}
        value={value ? dayjs(value) : null}
        onChange={(dateJs, dateString) => onChange(setting.field, dateString)}
      />
    );
  }

  return <div className="w-full my-2">{component}</div>;
};

function FilterDrawer<T>({
  settings,
  onApplyFilter,
  loading,
  className,
  style
}: FilterDrawerProps<T>) {
  const [params, setParams] = useState<T>({} as T);
  const [paramsApply, setParamsApply] = useState<T>({} as T);
  const [open, toggleOpen] = useToggle();

  const count = useMemo(() => Object.keys(paramsApply).length, [paramsApply]);

  const onChange = (field: string, value: string | number) => {
    setParams((prev) => {
      let clone = { ...prev };
      if (value === '' || value === undefined || value === null) {
        delete (clone as any)[field];
      } else {
        clone = { ...clone, [field]: value };
      }

      setParamsApply(clone);
      return clone;
    });
  };

  const onApply = () => {
    setParamsApply(params);
    onApplyFilter(paramsApply);
    toggleOpen();
  };

  const onClear = () => {
    const clear = {} as T;
    setParams(clear);
    setParamsApply(clear);
    onApplyFilter(clear);
    toggleOpen();
  };

  return (
    <div>
      <Badge showZero={false} color="cyan" count={count}>
        <Button
          loading={loading}
          onClick={toggleOpen}
          bgColor="bg-transparent"
          borderColor="border-primary"
          color="text-primary"
          icon={<Filter2 set="bold" />}
          className={className}
          style={style}
        >
          Filters
        </Button>
      </Badge>

      <Drawer
        open={open}
        onClose={toggleOpen}
        title="Transactions"
        extra={
          <div className="flex gap-1">
            <Button
              onClick={onClear}
              bgColor="bg-transparent"
              borderColor="border-text"
              color="text-text"
              icon={<CloseSquare set="bold" />}
            >
              Clear
            </Button>
            <Button onClick={onApply} icon={<TickSquare set="bold" />}>
              Apply
            </Button>
          </div>
        }
      >
        <List
          itemLayout="horizontal"
          dataSource={settings}
          renderItem={(item) => {
            return (
              <List.Item>
                <List.Item.Meta
                  title={item.label}
                  description={resolveFilterComponent(item, {
                    onChange,
                    isLoading: item.isLoading,
                    value:
                      (params as any)[item.field] ||
                      (paramsApply as any)[item.field] ||
                      item?.defaultValue
                  })}
                />
              </List.Item>
            );
          }}
        />
      </Drawer>
    </div>
  );
}

export default FilterDrawer;
