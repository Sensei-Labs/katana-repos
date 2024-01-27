import classNames from 'classnames';
import { TickSquare } from 'react-iconly';

import Image from '@/Components/Atoms/Image';
import Text from '@/Components/Atoms/Text';

type NFTVerifyCardProps = BaseComponent & {
  image: string;
  name: string;
  isValidToken?: boolean;
  size?: 'small' | 'middle';
};

const sizes = {
  small: 150,
  middle: 315
};

const NFTVerifyCard = ({
  className,
  image,
  name,
  isValidToken,
  size = 'middle'
}: NFTVerifyCardProps) => {
  return (
    <div
      className={classNames(
        'relative rounded-xl bg-card2',
        'cursor-pointer',
        className
      )}
    >
      <div className="relative">
        <Image
          src={image}
          objectFit="cover"
          height={sizes[size]}
          className="overflow-hidden relative rounded-t-xl"
          imageClass="rounded-t-xl transition hover:scale-105"
        />

        {!isValidToken && (
          <div
            className={classNames([
              'absolute top-0 left-0 z-10 w-full h-full',
              'bg-dark-transparent-08 flex justify-center items-center',
              'text-2xl font-bold rounded-t-xl'
            ])}
          >
            NFT not valid
          </div>
        )}
      </div>
      <div className="bg-semi-transparent p-2 rounded-b-xl">
        <Text withMargin={false} weight="bold" fontSize={20}>
          {name}
        </Text>
      </div>

      {isValidToken && (
        <div className="py-0 px-1 rounded-lg absolute top-1 right-1">
          <TickSquare set="bold" primaryColor="#17c964" />
        </div>
      )}
    </div>
  );
};

export default NFTVerifyCard;
