import { TwitterOutlined } from '@ant-design/icons';

import Button from '@/Components/Atoms/Button/Button';
import Discord from '@/Components/Atoms/Icons/Discord';

import { ROUTES } from '@/config';

interface ProfileAppsProps {
  discordToken?: string;
  twitterToken?: string;
}

const ProfileApps = ({ discordToken, twitterToken }: ProfileAppsProps) => {
  return (
    <div className="h-full flex flex-col gap-5 justify-center items-center">
      {!discordToken && (
        <a key="discord" className="flex" href={ROUTES.DISCORD_AUTH.path}>
          <Button
            variant="solid"
            className="text-xl px-2 leading-[0] max-w-[250px]"
            bgColor=""
            icon={<Discord />}
          >
            Connect Discord
          </Button>
        </a>
      )}
      {!!discordToken && (
        <Button
          variant="solid"
          className="text-xl px-2 leading-[0] max-w-[250px]"
          bgColor=""
          icon={<Discord />}
        >
          Discord Connected
        </Button>
      )}
      {!twitterToken && (
        <a key="twitter" className="flex" href={ROUTES.TWITTER_AUTH.path}>
          <Button
            variant="solid"
            className="text-xl px-2 leading-[0] max-w-[250px]"
            bgColor=""
            icon={<TwitterOutlined />}
          >
            Connect Twitter
          </Button>
        </a>
      )}
      {!!twitterToken && (
        <Button
          variant="solid"
          className="text-xl px-2 leading-[0] max-w-[250px]"
          bgColor=""
          icon={<TwitterOutlined />}
        >
          Twitter Connected
        </Button>
      )}
    </div>
  );
};

export default ProfileApps;
