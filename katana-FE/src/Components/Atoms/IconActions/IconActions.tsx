import { ReloadOutlined } from '@ant-design/icons';
import { Delete, EditSquare, IconProps, Plus, CloseSquare } from 'react-iconly';

const TYPE_ENUM = {
  delete: 'delete',
  add: 'add',
  edit: 'edit',
  reload: 'reload',
  close: 'close'
};

type IconActionsProps = BaseComponent & {
  type: keyof typeof TYPE_ENUM;
  size?: number | 'small' | 'medium' | 'large' | 'xlarge';
};

const typesIcon = {
  [TYPE_ENUM.delete]: (props: IconProps) => <Delete set="bold" {...props} />,
  [TYPE_ENUM.add]: (props: IconProps) => <Plus set="bold" {...props} />,
  [TYPE_ENUM.edit]: (props: IconProps) => <EditSquare set="bold" {...props} />,
  [TYPE_ENUM.close]: (props: IconProps) => (
    <CloseSquare set="bold" {...props} />
  ),
  [TYPE_ENUM.reload]: (props: IconProps) => (
    <ReloadOutlined {...(props as any)} />
  )
} as const;

const IconActions = ({ type, size, ...rest }: IconActionsProps) => {
  const Component = typesIcon[type];
  return <Component size={size} {...rest} />;
};

export default IconActions;
