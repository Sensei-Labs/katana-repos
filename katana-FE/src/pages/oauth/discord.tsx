import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import classNames from 'classnames';
import { Alert, notification } from 'antd';

import { ROUTES } from '@/config';
import Text from '@/Components/Atoms/Text';
import { PublicLayout } from '@/Components/Organisms/Layout';
import BackgroundPage from '@/Components/Atoms/BackgroundPage';
import MonkeySpinner from '@/Components/Atoms/MonkeySpinner';
import { useScope } from '@/Contexts/Scope';
import { formatErrorMessage } from '@/utils/formatError';
import Button from '@/Components/Atoms/Button';

const Discord = () => {
  const router = useRouter();
  const {
    loading,
    hasAccess,
    onLogin,
    initLoading,
    loadingDiscordAuth,
    onLoginDiscordAndGetScopeInBackend
  } = useScope();
  const [errorText, setErrorText] = React.useState<string>('');
  const code = router.query.code as string;
  const error_description = router.query.error_description as
    | string
    | undefined;

  useEffect(() => {
    if (!code) return;
    (async () => {
      try {
        const discordInfo = await onLoginDiscordAndGetScopeInBackend(code);

        onLogin(discordInfo).catch((err) => {
          console.log(err);
          notification.error({
            message: 'Oops!',
            description: err.message
          });
        });
      } catch (err) {
        setErrorText(formatErrorMessage(err));
        notification.error({
          message: 'Oops!',
          description: formatErrorMessage(err)
        });
      }
    })();
  }, [code]);

  const isAllLoading = loading || loadingDiscordAuth;

  return (
    <PublicLayout>
      <BackgroundPage
        className={classNames([
          'flex flex-col items-center justify-start min-h-screen'
        ])}
      >
        <div className="mt-52 w-full max-w-[720px] px-5 pb-20">
          <div className="w-full">
            {((!isAllLoading && !hasAccess && !initLoading) ||
              !!error_description ||
              errorText) && (
              <>
                <Alert
                  showIcon
                  style={{ zIndex: -1 }}
                  type="error"
                  message={
                    <Text>
                      {error_description ||
                        `You need to join our community before you can log in, please make sure to join our Discord server and try again`}
                    </Text>
                  }
                />
                <Button className="mt-5 mx-auto block">
                  <Link href={ROUTES.LOGIN.path} replace>
                    Go Back
                  </Link>
                </Button>
              </>
            )}
            {isAllLoading && (
              <div className="p-10 rounded-2xl flex justify-center">
                <MonkeySpinner />
              </div>
            )}
          </div>
        </div>
      </BackgroundPage>
    </PublicLayout>
  );
};

export default Discord;
