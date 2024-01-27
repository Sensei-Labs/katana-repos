import { List, ListProps } from 'antd';
import Text from '@/Components/Atoms/Text';

export interface NewItemProps {
  id: number;
  title: string;
  shortContent: string;
  content: string;
}

type NewListProps = BaseComponent & {
  dataSource: NewItemProps[];
  loading: boolean;
  onClickItem(item: NewItemProps): void;
  pagination?: ListProps<any>['pagination'];
};

const NewList = (props: NewListProps) => {
  return (
    <List
      {...props}
      renderItem={(item) => (
        <List.Item key={item.id} onClick={() => props?.onClickItem(item)}>
          <List.Item.Meta
            title={<Text>{item.title}</Text>}
            description={
              <Text style={{ color: 'inherit' }}>{item.shortContent}</Text>
            }
          />
        </List.Item>
      )}
    />
  );
};

export default NewList;
