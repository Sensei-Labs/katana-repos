import { Descriptions, Tag } from 'antd';
import Text from '@/Components/Atoms/Text';
import { formatDateAgo } from '@/utils/formatDateTime';
import type { AnswerType, QuestionType } from './QuestionList';

export default function AnswerContent({
  question,
  ...props
}: (QuestionType | AnswerType) & { question?: QuestionType }) {
  return (
    <Descriptions title="" layout="vertical" bordered>
      <Descriptions.Item
        label={
          <Text fontSize="0.8rem">
            <span className="text-white mr-3">
              {props?.by?.walletAddress}{' '}
              {props.by.walletAddress === question?.by?.walletAddress && (
                <Tag className="ml-1" color="green">
                  Author
                </Tag>
              )}
            </span>
            <span>{formatDateAgo(props.createdAt)}</span>
          </Text>
        }
      >
        <div
          className="py-3"
          dangerouslySetInnerHTML={{
            __html: props.content
          }}
        />
      </Descriptions.Item>
    </Descriptions>
  );
}
