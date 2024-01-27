import Link from 'next/link';
import classNames from 'classnames';
import { Dropdown, Space, Spin } from 'antd';
import { ChevronLeft, MoreSquare } from 'react-iconly';
import { GlobalOutlined, TwitterOutlined } from '@ant-design/icons';

import { ROUTES } from '@/config';
import Text from '@/Components/Atoms/Text';
import Title from '@/Components/Atoms/Title';
import Button from '@/Components/Atoms/Button';
import Tooltip from '@/Components/Atoms/Tooltip';
import { useProjectOne } from '@/Contexts/ProjectOne';
import { resolveTwitterUrl } from '@/utils/resolveUrl';
import Discord from '@/Components/Atoms/Icons/Discord';
import IconWrapper from '@/Components/Atoms/IconWrapper';
import VerifyIcon from '@/Components/Atoms/Icons/Verify';
import { RenderIconFromKey } from '@/Components/Atoms/Icons';

import Image from '../Image';

import { AvatarAStyle, SkeletonAvatarStyle, SkeletonStyle } from './style';

const Avatar = ({ src }: { src?: string }) => {
  return (
    <div
      className={classNames([
        'absolute top-[-30px] left-5 z-20',
        'rounded-full bg-background dark:bg-dark',
        'border-2 border-solid',
        {
          'border-verify': src,
          'border-transparent': !src
        }
      ])}
    >
      {src ? (
        <AvatarAStyle size={125} src={src} />
      ) : (
        <SkeletonAvatarStyle active size={125} />
      )}
    </div>
  );
};

const Banner = () => {
  const { treasury, loading, collectionCount } = useProjectOne();

  const name = treasury?.name || '';
  const twitterUrl = resolveTwitterUrl(treasury?.twitterUser);
  const discordUrl = treasury?.discordLink || '';
  const websiteUrl = treasury?.websiteLink || '';
  const image = treasury?.frontPage?.url || '';
  const avatarImage = treasury?.thumbnail?.url || '';

  return (
    <div>
      <Link className="w-fit block" href={ROUTES.TREASURIES.path}>
        <Button
          className="mb-5"
          variant="semi-trans"
          icon={<ChevronLeft set="bold" />}
        >
          Back
        </Button>
      </Link>

      <div className={classNames(['h-80 w-full relative rounded-3xl'])}>
        {!image ? (
          <SkeletonStyle className="rounded-3xl" active />
        ) : (
          <Image
            src={image}
            width="100%"
            height="100%"
            objectFit="cover"
            className={classNames(['w-full h-full rounded-3xl'])}
          />
        )}

        {/* Layer color */}
        <div className="absolute z-10 bg-semi-transparent h-full w-full top-0 left-0 rounded-3xl" />
      </div>

      <div className="relative flex py-3">
        <Avatar src={avatarImage} />
        <div className="flex gap-5 w-full flex-col md:flex-row md:h-[125px]">
          <div className="pl-[155px]">
            <Space>
              <Title withMargin={false}>{name}</Title>
              {name && (
                <IconWrapper className="text-lg text-verify">
                  <VerifyIcon />
                </IconWrapper>
              )}
              {loading && <Spin size="small" />}
            </Space>
            <Text color="text-info" weight="bold">
              {collectionCount} Collections
            </Text>
          </div>

          <div className="flex gap-3 justify-end mb-5 h-fit">
            {discordUrl && (
              <Tooltip placement="top" text="Discord">
                <a target="_blank" href={discordUrl} rel="noopener noreferrer">
                  <Button
                    className="px-2"
                    icon={<Discord />}
                    variant="semi-trans"
                    bgColor="bg-transparent"
                  />
                </a>
              </Tooltip>
            )}
            {twitterUrl && (
              <Tooltip placement="top" text="Twitter">
                <a target="_blank" href={twitterUrl} rel="noopener noreferrer">
                  <Button
                    className="px-2"
                    variant="semi-trans"
                    bgColor="bg-transparent"
                    icon={<TwitterOutlined />}
                  />
                </a>
              </Tooltip>
            )}
            {websiteUrl && (
              <Tooltip placement="top" text="Website">
                <a target="_blank" href={websiteUrl} rel="noopener noreferrer">
                  <Button
                    className="px-2"
                    variant="semi-trans"
                    bgColor="bg-transparent"
                    icon={<GlobalOutlined />}
                  />
                </a>
              </Tooltip>
            )}
            {!!treasury?.moreLinks?.length && (
              <Dropdown
                trigger={['click']}
                menu={{
                  items: treasury.moreLinks.map((item, index) => {
                    if (item.link) {
                      return {
                        key: index,
                        label: (
                          <a
                            href={item.link}
                            target="_blank"
                            rel="noreferrer noopener"
                          >
                            <Text
                              key={index}
                              className="items-center flex gap-1"
                            >
                              <RenderIconFromKey name={item.icon} />
                              {item.label}
                            </Text>
                          </a>
                        )
                      };
                    }
                    return {
                      key: index,
                      label: (
                        <Text key={index} className="items-center flex gap-1">
                          <RenderIconFromKey name={item.icon} />
                          {item.label}
                        </Text>
                      )
                    };
                  })
                }}
              >
                <Button
                  className="px-2"
                  variant="semi-trans"
                  bgColor="bg-transparent"
                  icon={<MoreSquare set="bold" />}
                />
              </Dropdown>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
