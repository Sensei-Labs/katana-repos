import { Input } from 'antd';
import classNames from 'classnames';
import { SearchProps } from 'antd/es/input';

type SearchInputProps = BaseComponent & SearchProps;

const SearchInput = ({
  className,
  loading,
  style,
  placeholder,
  ...rest
}: SearchInputProps) => {
  return (
    <Input.Search
      placeholder={placeholder}
      className={classNames(['placeholder:text-transparent-06', className])}
      {...rest}
    />
  );
};

export default SearchInput;
