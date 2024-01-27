import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo
} from 'react';
import Link from 'next/link';
import { Button, notification } from 'antd';
import useSWR, { useSWRConfig } from 'swr';

import { fetcher } from '@/services/api';
import { API_ROUTES } from '@/config/api';
import resolveUrl from '@/utils/resolveUrl';
import { useScope } from '@/Contexts/Scope';
import useTraceSync from '@/hooks/useTraceSync';
import { TreasuryType } from '@/Contexts/Projects';
import { onReadNotification } from '@/fetches/notifications';
import { NOTIFICATION_SERVER_URL, ROUTES } from '@/config';
import { BrandIcon } from '@/Components/Atoms/Brand';

export enum NotificationState {
  NEW = 'new',
  READ = 'read',
  DELETE = 'delete'
}

export enum NotificationTypeEnum {
  QUESTION = 'question',
  ANSWER = 'answer',
  INFO = 'info',
  NEWS = 'news'
}

export type NotificationType = {
  id: number;
  title: string;
  body: string;
  date: string;
  link?: string;
  question?: {
    id: number;
    title: string;
    content: string;
    treasury: TreasuryType;
  };
  state: NotificationState;
  type: NotificationTypeEnum;
};

type NotificationsContextType = {
  isLoading: boolean;
  newsCount: number;
  onRefresh(): void;
  onAllRead(): void;
  notifications: NotificationType[];
};

const defaultValues: NotificationsContextType = {
  isLoading: true,
  newsCount: 0,
  onRefresh() {},
  onAllRead() {},
  notifications: []
};

const NotificationContext =
  createContext<NotificationsContextType>(defaultValues);

export const NotificationProvider = ({ children }: PropsWithChildren) => {
  const { hasAccess, loading: authLoading, user } = useScope();
  const { mutate } = useSWRConfig();
  const [loadingTrace, onTrace] = useTraceSync();

  const getPath = useCallback(() => {
    if (!hasAccess) return null;
    return API_ROUTES.PLURAL_NOTIFICATION.path + '?sort=id:desc';
  }, [hasAccess]);

  const {
    isLoading,
    data,
    mutate: mutateArray
  } = useSWR<ResponseServer<NotificationType[]>>(getPath(), fetcher);

  const newsCount = useMemo<number>(() => {
    if (!data?.data) return 0;
    return data?.data?.filter((item) => item.state === NotificationState.NEW)
      ?.length;
  }, [data?.data]);

  const onlyNews = useMemo<NotificationType[]>(() => {
    if (!data?.data) return [];
    return data?.data?.filter((item) => item.state === NotificationState.NEW);
  }, [data?.data]);

  const onChangeStates = useCallback(
    (ids: number[], state: NotificationState) => {
      if (data?.data) {
        const deepCopy = JSON.parse(JSON.stringify(data?.data || []));

        ids.forEach((id) => {
          const index = data.data.findIndex((item) => item.id === id);
          deepCopy[index].state = state;
        });

        return mutateArray({
          ...data,
          data: deepCopy
        });
      }
    },
    [data, mutateArray]
  );

  const onRefresh = useCallback(() => {
    return mutate(getPath());
  }, [getPath, mutate]);

  const onAllRead = useCallback(async () => {
    const idsToChangeState: number[] = [];
    const promisesAll = onlyNews.map(({ id }) => {
      idsToChangeState.push(id);
      return onReadNotification(id);
    });

    await onTrace(async () => {
      await Promise.all(promisesAll);
      await onChangeStates(idsToChangeState, NotificationState.READ);
    });
  }, [onChangeStates, onTrace, onlyNews]);

  // notification server
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const startSocket = () => {
        const socket = new WebSocket(NOTIFICATION_SERVER_URL);
        // Connection opened
        socket.addEventListener('open', () => {
          console.log('Notification connection opened');
          socket.send(user.email);
        });

        socket.addEventListener('message', (event) => {
          const data = JSON.parse(event.data);

          const link = data?.link ? data?.link : '';
          const internalLink =
            data?.treasury && data?.question
              ? resolveUrl(
                  ROUTES.DISCUSSION.path,
                  ROUTES.DISCUSSION.params.address,
                  data?.treasury
                ) + `/${data?.question}`
              : null;

          notification.open({
            icon: <BrandIcon width={30} height={30} />,
            message: data.title,
            description: data.content,
            btn: link ? (
              <a href={data.link}>
                <Button size="small" type="primary">
                  More!
                </Button>
              </a>
            ) : internalLink ? (
              <Link href={internalLink}>
                <Button size="small" type="primary">
                  More!
                </Button>
              </Link>
            ) : null
          });
        });

        socket.onclose = function (e) {
          console.log(
            'Socket is closed. Reconnect will be attempted in 1 second.',
            e.reason
          );
          setTimeout(function () {
            startSocket();
          }, 1000);
        };

        socket.onerror = function (event) {
          console.error('Socket encountered error closing socket');
          socket.close();
        };
      };

      startSocket();
    }
  }, [user]);

  return (
    <NotificationContext.Provider
      value={{
        newsCount,
        onRefresh,
        onAllRead,
        isLoading: isLoading || authLoading || loadingTrace,
        notifications: data?.data || []
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => useContext(NotificationContext);
