import { useMemo } from 'react';
import * as icons from 'react-iconly';
import Select from '@/Components/Atoms/Select';

type SelectIconsProps = BaseComponent & {
  onChange?: (value: any) => void;
  value?: any;
};

const SelectIcons = (props: SelectIconsProps) => {
  const options = useMemo(() => {
    if (icons) {
      return Object.entries(icons)
        .map(([key, Icon]) => {
          if (
            key === 'useIconlyTheme' ||
            key === 'IconlyProvider' ||
            key === 'Iconly'
          ) {
            return null;
          }
          return {
            label: key,
            value: key,
            icon: <Icon set="bold" />
          };
        })
        .filter(Boolean);
    }
    return [];
  }, []);

  return <Select {...props} withSearch items={options as any} />;
};

export default SelectIcons;
