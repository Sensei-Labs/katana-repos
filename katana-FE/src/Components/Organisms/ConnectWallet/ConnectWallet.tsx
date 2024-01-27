import { ReactNode, useCallback } from 'react';
import { useRouter } from 'next/router';
import classNames from 'classnames';
import useSWR from 'swr';
import Text from '@/Components/Atoms/Text';
import Title from '@/Components/Atoms/Title';
import DiscordButton from '@/Components/Atoms/DiscordButton';

import { API_ROUTES } from '@/config/api';
import { fetcher } from '@/services/api';
import { WrapperStyle } from './style';

type ConnectWalletProps = {
  title?: string;
  className?: string;
  description?: ReactNode;
  onContinue?: () => void;
};

const ConnectWallet = ({
  className,
  description,
  title,
  onContinue
}: ConnectWalletProps) => {
  const { query, push } = useRouter();

  const { data } = useSWR<{ url: string }>(
    API_ROUTES.GET_DISCORD_URL.path,
    fetcher
  );

  const discordButtonClick = useCallback(() => {
    if (!data?.url) return;
    if (!query?.code) return push(data?.url);
    onContinue?.();
  }, [data?.url, onContinue, push, query?.code]);

  return (
    <WrapperStyle
      className={classNames(
        ['p-5 md:p-10 bg-dark-transparent-04 rounded-xl'],
        className
      )}
    >
      <Title className="text-white text-center">{title}</Title>
      <Text color="text-white" withMargin>
        {description}
      </Text>

      <DiscordButton
        onClick={discordButtonClick}
        text="Continue with Discord"
        className="w-full flex text-[16px] font-bold text-white justify-center py-2 h-auto items-center"
        iconClassName="leading-none text-[20px]"
      />
    </WrapperStyle>
  );
};

export default ConnectWallet;
