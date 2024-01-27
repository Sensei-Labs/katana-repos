import useSWR, { useSWRConfig } from 'swr';
import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import { Chat, ChevronLeft, CloseSquare } from 'react-iconly';
import {
  Col,
  Descriptions,
  Divider,
  Form,
  Modal,
  notification,
  Result,
  Row,
  Skeleton,
  Space,
  Typography
} from 'antd';

import { fetcher } from '@/services/api';
import { API_ROUTES } from '@/config/api';
import { useProjectOne } from '@/Contexts/ProjectOne';

import Text from '@/Components/Atoms/Text';
import Button from '@/Components/Atoms/Button';
import IconActions from '@/Components/Atoms/IconActions';

import { QuestionType } from './Components/QuestionList';
import AnswerContent from './Components/AnswerContent';
import StateQuestion, { StateQuestionEnum } from './Components/StateQuestion';
import {
  AnswerType,
  createAnswer,
  deleteQuestion,
  QuestionType as QuestionFormType,
  updateQuestion
} from '@/fetches/forum';
import { formatErrorMessage } from '@/utils/formatError';
import useTraceSync from '@/hooks/useTraceSync';
import PermissionSection from '@/Components/Atoms/PermissionSection';
import { getAccess, ScopeType } from '@/hooks/useRedirectTreasuryAccess';
import resolveUrl from '@/utils/resolveUrl';
import { ROUTES } from '@/config';

const Editor = dynamic(() => import('@/Components/Atoms/Editor'), {
  ssr: false
});

const DiscussionDetailTemplate = () => {
  const [form] = Form.useForm();
  const { mutate } = useSWRConfig();
  const [loadingNew, onTraceNew] = useTraceSync();
  const { loading, treasury, scopeTreasury } = useProjectOne();
  const { query, ...router } = useRouter();

  const pathFetch = useMemo(() => {
    if (loading || !treasury?.id || !query?.id) return null;

    return `${API_ROUTES.PLURAL_QUESTION.path}/${query.id}`;
  }, [loading, query.id, treasury?.id]);

  const { data, isLoading } = useSWR<ResponseServer<QuestionType>>(
    pathFetch,
    fetcher
  );

  if (isLoading || loading) return <Skeleton active />;
  const question = data?.data;
  if (!question) return <Result status="500" />;

  const isSomeAuthor = question.by.walletAddress === '';
  const isAdmin = getAccess(scopeTreasury, ScopeType.CAN_BE_WRITE);
  const enableActions = question.state !== StateQuestionEnum.CLOSED;

  const onNewAnswer = async (values: AnswerType) => {
    try {
      values.question = question.id;
      await onTraceNew(async () => {
        await createAnswer(values);
        if (!question?.answers?.length && !isSomeAuthor) {
          await updateQuestion(question.id, { state: StateQuestionEnum.OPEN });
        }
      });
      await mutate(pathFetch);
      form.resetFields();
    } catch (e) {
      console.log(e);
      notification.error({
        message: 'Oops!',
        description: formatErrorMessage(e)
      });
    }
  };

  const onEditQuestion = async (values: Partial<QuestionFormType>) => {
    try {
      await onTraceNew(() => updateQuestion(question.id, values));
      await mutate(pathFetch);
      form.resetFields();
    } catch (e) {
      console.log(e);
      notification.error({
        message: 'Oops!',
        description: formatErrorMessage(e)
      });
    }
  };

  const onCloseQuestion = async () => {
    try {
      await onTraceNew(() =>
        updateQuestion(question.id, { state: StateQuestionEnum.CLOSED })
      );
      await mutate(pathFetch);
      form.resetFields();
    } catch (e) {
      console.log(e);
      notification.error({
        message: 'Oops!',
        description: formatErrorMessage(e)
      });
    }
  };

  const onDeleteQuestion = () => {
    const action = async () => {
      try {
        await onTraceNew(() => deleteQuestion(question.id));
        form.resetFields();
        return router.push(
          resolveUrl(
            ROUTES.DISCUSSION.path,
            ROUTES.DISCUSSION.params.address,
            query.address as string
          )
        );
      } catch (e) {
        console.log(e);
        notification.error({
          message: 'Oops!',
          description: formatErrorMessage(e)
        });
      }
    };

    Modal.confirm({
      okType: 'danger',
      title: 'Are you sure you want to delete this question?',
      content: 'This action cannot be undone.',
      onOk: action
    });
  };

  return (
    <div>
      <div className="mb-5">
        <Button
          variant="semi-trans"
          onClick={router.back}
          icon={<ChevronLeft set="bold" />}
        >
          Back
        </Button>

        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
          <div className="flex-1">
            <Typography.Title
              level={1}
              style={{ marginBottom: 0 }}
              className="pt-5 w-full flex items-center justify-between"
              editable={
                isSomeAuthor
                  ? {
                      icon: (
                        <Button
                          variant="semi-trans"
                          className="ml-auto mr-0"
                          icon={<IconActions type="edit" />}
                          disabled={!enableActions || loadingNew}
                        >
                          Edit
                        </Button>
                      ),
                      onChange(text) {
                        return onEditQuestion({ title: text });
                      },
                      autoSize: true,
                      text: question.title
                    }
                  : false
              }
            >
              <span>
                {question?.title}{' '}
                <Text as="span" fontSize="2rem" color="text-secondaryText2">
                  #{question?.id}
                </Text>
              </span>
            </Typography.Title>
          </div>

          {(isSomeAuthor || isAdmin) && enableActions && (
            <Button
              variant="semi-trans"
              onClick={onDeleteQuestion}
              className="ml-auto mr-0 mt-5"
              icon={<IconActions type="delete" />}
              disabled={!enableActions || loadingNew}
            >
              Delete
            </Button>
          )}
        </div>

        <StateQuestion state={question?.state} />
      </div>

      <Divider />

      {!loading ? (
        <Row gutter={[0, 20]}>
          <Col span={24}>
            <AnswerContent {...question} question={question} />
          </Col>

          {question?.answers?.map((item) => {
            return (
              <Col span={24} key={item.id}>
                <AnswerContent {...item} question={question} />
              </Col>
            );
          })}

          {enableActions && (
            <Col span={24}>
              <Descriptions title="" layout="vertical" bordered>
                <Descriptions.Item label="New answer">
                  <Form form={form} layout="vertical" onFinish={onNewAnswer}>
                    <Form.Item name="content" rules={[{ required: true }]}>
                      <Editor />
                    </Form.Item>
                    <Form.Item className="text-right">
                      <Space>
                        <PermissionSection
                          scope={[
                            ScopeType.IS_CREATOR,
                            ScopeType.CAN_BE_WRITE,
                            () => isSomeAuthor
                          ]}
                        >
                          <Button
                            className="mr-2"
                            variant="semi-trans"
                            disabled={loadingNew}
                            icon={<CloseSquare set="bold" />}
                            onClick={async () => {
                              const haveErrors = form.getFieldsError()[0];
                              if (haveErrors.errors.length)
                                return form.validateFields();

                              await form.submit();
                              return onCloseQuestion();
                            }}
                          >
                            Close
                          </Button>
                        </PermissionSection>
                        <Button
                          htmlType="submit"
                          loading={loadingNew}
                          bgColor="bg-success"
                          icon={<Chat set="bold" />}
                        >
                          Comment
                        </Button>
                      </Space>
                    </Form.Item>
                  </Form>
                </Descriptions.Item>
              </Descriptions>
            </Col>
          )}
        </Row>
      ) : (
        <div className="mt-5">
          <Skeleton active />
        </div>
      )}
    </div>
  );
};
export default DiscussionDetailTemplate;
