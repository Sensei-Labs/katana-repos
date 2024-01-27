import Link from 'next/link';

import { ROUTES } from '@/config';
import Text from '@/Components/Atoms/Text';
import { formatDateAgo } from '@/utils/formatDateTime';
import {
  NotificationState,
  NotificationType,
  NotificationTypeEnum
} from '@/Contexts/Notifications';

import { MenuItemContentStyle, MenuItemNewStyle, MenuItemStyle } from './style';
import resolveUrl from '@/utils/resolveUrl';
import { Typography } from 'antd';

function NotificationQuestion({
  title,
  question,
  date,
  state
}: NotificationType) {
  return (
    <Link
      href={
        resolveUrl(
          ROUTES.DISCUSSION.path,
          ROUTES.DISCUSSION.params.address,
          question?.treasury?.id
        ) + `?question=${question?.id}`
      }
    >
      <MenuItemStyle>
        <MenuItemContentStyle>
          <Text
            fontSize="1.2rem"
            color={
              state === NotificationState.NEW ? 'text-secondary' : 'text-white'
            }
          >
            {question?.treasury?.name || 'New question'}
          </Text>
          <Text color="text-secondaryText2">{title}</Text>
          <Text fontSize="0.8rem" color="text-secondaryText3">
            {formatDateAgo(date)}
          </Text>
        </MenuItemContentStyle>

        {state === NotificationState.NEW && <MenuItemNewStyle />}
      </MenuItemStyle>
    </Link>
  );
}

function NotificationAnswer({
  title,
  question,
  date,
  state
}: NotificationType) {
  return (
    <Link
      href={
        resolveUrl(
          ROUTES.DISCUSSION.path,
          ROUTES.DISCUSSION.params.address,
          question?.treasury?.id
        ) + `/${question?.id}`
      }
    >
      <MenuItemStyle>
        <MenuItemContentStyle>
          <Text
            overflowLines={1}
            fontSize="1.2rem"
            color={
              state === NotificationState.NEW ? 'text-secondary' : 'text-white'
            }
          >
            {title || 'New answer'}
          </Text>
          <Text color="text-secondaryText2">{title}</Text>
          <Text fontSize="0.8rem" color="text-secondaryText3">
            {formatDateAgo(date)}
          </Text>
        </MenuItemContentStyle>

        {state === NotificationState.NEW && <MenuItemNewStyle />}
      </MenuItemStyle>
    </Link>
  );
}

function NotificationDefault({
  title,
  body,
  date,
  link,
  state
}: NotificationType) {
  return (
    <a href={link || '#'}>
      <MenuItemStyle>
        <MenuItemContentStyle>
          <Text
            overflowLines={1}
            fontSize="1.2rem"
            color={
              state === NotificationState.NEW ? 'text-secondary' : 'text-white'
            }
          >
            {title || 'New notification'}
          </Text>
          <Typography.Paragraph
            ellipsis={{ expandable: false, rows: 3 }}
            className="text-secondaryText2"
          >
            {body}
          </Typography.Paragraph>
          <Text fontSize="0.8rem" color="text-secondaryText3">
            {formatDateAgo(date)}
          </Text>
        </MenuItemContentStyle>

        {state === NotificationState.NEW && <MenuItemNewStyle />}
      </MenuItemStyle>
    </a>
  );
}

export default function NotificationItem(props: NotificationType) {
  switch (props.type) {
    case NotificationTypeEnum.QUESTION:
      return <NotificationQuestion {...props} />;
    case NotificationTypeEnum.ANSWER:
      return <NotificationAnswer {...props} />;
    default:
      return <NotificationDefault {...props} />;
  }
}
