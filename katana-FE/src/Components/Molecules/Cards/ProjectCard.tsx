import { Tag } from 'antd';
import { useMemo } from 'react';
import classNames from 'classnames';

import Text from '@/Components/Atoms/Text';
import Image from '@/Components/Atoms/Image';
import Tooltip from '@/Components/Atoms/Tooltip';
import TooltipContent from '@/Components/Molecules/Cards/TooltipContent';

type CollectionCardProps = BaseComponent & {
  image: string;
  description: string;
  projectName: string;
  tags: string[];
  size?: 'small' | 'default';
  numberCollections?: number;
};

const ProjectCard = ({
  className,
  image,
  projectName,
  description,
  tags,
  size = 'default',
  numberCollections = 0
}: CollectionCardProps) => {
  const isDefault = useMemo(() => {
    return size === 'default';
  }, [size]);

  return (
    <Tooltip
      overlayClassName="w-[350px] max-w-full"
      text={<TooltipContent name={projectName} description={description} />}
    >
      <div
        className={classNames(
          'bg-card rounded-3xl cursor-pointer max-w-full',
          className
        )}
      >
        <div className="relative bg-cardImageBackground rounded-t-3xl rounded-b-lg">
          <Image
            src={image}
            width="100%"
            objectFit="cover"
            imageClass="rounded-t-3xl rounded-b-lg"
            height={isDefault ? 300 : 175}
          />

          {isDefault && (
            <div
              className={classNames(['absolute top-0 left-0 w-full px-0 py-2'])}
            >
              <div className="flex gap-2 justify-end my-1">
                {tags.map((tag, index) => {
                  return (
                    <Tag
                      key={`tag-${index}`}
                      color="cyan"
                      className="py-1 px-2 rounded-md capitalize"
                    >
                      {tag}
                    </Tag>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <div className="pt-3 pb-5 max-w-full">
          <div
            className={classNames([
              {
                'px-2': !isDefault,
                'px-4': isDefault
              }
            ])}
          >
            <Text
              className="font-sans"
              withMargin={false}
              weight="bold"
              fontSize={20}
            >
              {projectName}
            </Text>
            <Text withMargin={false} color="text-brand">
              {numberCollections} Collections
            </Text>
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default ProjectCard;
