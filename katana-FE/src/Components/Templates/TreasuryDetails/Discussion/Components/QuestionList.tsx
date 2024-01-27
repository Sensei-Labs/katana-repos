import { List } from 'antd';
import { formatDateAgo } from '@/utils/formatDateTime';
import Link from 'next/link';
import resolveUrl from '@/utils/resolveUrl';
import { ROUTES } from '@/config';
import { useProjectOne } from '@/Contexts/ProjectOne';
import StateQuestion, { StateQuestionEnum } from './StateQuestion';

export type AnswerType = {
  id: number;
  content: string;
  createdAt: string;
  by: {
    walletAddress: string;
  };
};

export type QuestionType = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  state: StateQuestionEnum;
  answers: AnswerType[];
  by: {
    walletAddress: string;
  };
};

type QuestionListType = {
  data: QuestionType[];
  loading: boolean;
};

function createDescription({ id, createdAt, by }: QuestionType) {
  return `#${id} opened ${formatDateAgo(
    createdAt
  )} by <span style="font-size: 0.85rem">${by?.walletAddress}</span>`;
}

export default function QuestionList({ data, loading }: QuestionListType) {
  const { treasury } = useProjectOne();

  return (
    <List
      bordered
      className="mt-5"
      dataSource={data}
      loading={loading}
      renderItem={(item) => (
        <Link
          href={resolveUrl(
            resolveUrl(
              ROUTES.DISCUSSION_DETAIL.path,
              ROUTES.DISCUSSION_DETAIL.params.address,
              treasury?.id
            ),
            ROUTES.DISCUSSION_DETAIL.params.id,
            item.id
          )}
        >
          <List.Item
            className="cursor-pointer"
            actions={[<StateQuestion key={1} state={item.state} />]}
            style={{
              borderBottom: '1px solid var(--colors-border)'
            }}
          >
            <List.Item.Meta
              title={item.title}
              description={
                <span
                  dangerouslySetInnerHTML={{ __html: createDescription(item) }}
                />
              }
            />
          </List.Item>
        </Link>
      )}
    />
  );
}
