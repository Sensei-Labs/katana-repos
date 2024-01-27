import { CloseSquare } from 'react-iconly';
import { Col, Input, Row, Select } from 'antd';

import useToggle from '@/hooks/useToggle';
import Text from '@/Components/Atoms/Text';
import Title from '@/Components/Atoms/Title';
import Button from '@/Components/Atoms/Button';
import IconActions from '@/Components/Atoms/IconActions';
import AddNewQuestion from '@/Components/Organisms/AddNewQuestion';
import { FilterEnum, FilterType, SortEnum, StateEnum } from '@/fetches/forum';

interface HeaderProps {
  filters: FilterType | null;
  onRefresh: () => void;
  onClear: () => void;
  onFilter: (key: FilterEnum, value: string) => void;
}

export default function Header({
  onRefresh,
  onFilter,
  onClear,
  filters
}: HeaderProps) {
  const [open, toggleOpen] = useToggle();

  return (
    <div>
      <Title
        fontSize="3rem"
        className="mt-0"
        lineHeight="3.2rem"
        fontFamily="font-sans"
      >
        Forum
      </Title>

      <Text color="text-secondaryText2" className="max-w-lg">
        This Forum is the place to discuss, ask questions and find answers, get
        feedback or just talk with other Community...
      </Text>

      <Row gutter={[20, 20]} className="mt-5">
        <Col xs={24} md={10} lg={16}>
          <Input.Search
            placeholder="Search title"
            onSearch={(value) => onFilter(FilterEnum.SEARCH_TEXT, value)}
          />
        </Col>
        <Col xs={24} md={14} lg={8}>
          <Row gutter={[10, 10]}>
            <Col xs={8} md={6}>
              <Select
                className="w-full"
                placeholder="Sort"
                value={filters?.sort}
                onSelect={(value) => onFilter(FilterEnum.SORT, value)}
                options={[
                  {
                    label: 'Newest',
                    value: SortEnum.NEWEST
                  },
                  {
                    label: 'Oldest',
                    value: SortEnum.OLDEST
                  },
                  {
                    label: 'Alphabetical',
                    value: SortEnum.ALPHABETICAL
                  }
                ]}
              />
            </Col>
            <Col xs={8} md={6}>
              <Select
                className="w-full"
                placeholder="State"
                value={filters?.state}
                onSelect={(value) => onFilter(FilterEnum.STATE, value)}
                options={[
                  {
                    label: 'New',
                    value: StateEnum.NEW
                  },
                  {
                    label: 'Open',
                    value: StateEnum.OPEN
                  },
                  {
                    label: 'Closed',
                    value: StateEnum.CLOSED
                  }
                ]}
              />
            </Col>
            <Col xs={8} md={3}>
              <Button
                onClick={onClear}
                variant="semi-trans"
                icon={<CloseSquare set="bold" />}
              />
            </Col>
            <Col xs={12} md={9}>
              <Button
                block
                onClick={toggleOpen}
                className="flex justify-center"
                icon={<IconActions type="add" />}
              >
                New question
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      <AddNewQuestion onRefresh={onRefresh} open={open} onClose={toggleOpen} />
    </div>
  );
}
