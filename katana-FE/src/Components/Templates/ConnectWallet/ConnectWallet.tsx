import { useRouter } from 'next/router';
import React, { ReactNode, useCallback } from 'react';

import { ROUTES } from '@/config';
import dynamic from 'next/dynamic';
import MonkeySpinner from '@/Components/Atoms/MonkeySpinner';

const ConnectWallet = dynamic(
  () => import('@/Components/Organisms/ConnectWallet'),
  { ssr: false }
);

type ConnectWalletProps = {
  title?: string;
  className?: string;
  description?: ReactNode;
};

const ConnectWalletTemplate = ({
  className,
  title = 'Connect with Discord',
  description = 'Connect your discord for verify your account'
}: ConnectWalletProps) => {
  const router = useRouter();

  const onContinue = useCallback(() => {
    return router.push(ROUTES.TREASURIES.path);
  }, [router]);

  return (
    <div className="w-full max-w-[720px] px-5 pb-20">
      <ConnectWallet
        title={title}
        onContinue={onContinue}
        className={className}
        description={description}
      />
    </div>
  );
};

export default ConnectWalletTemplate;
