import { TwitterOutlined } from '@ant-design/icons';
import { useMemo } from 'react';

import Button from '@/Components/Atoms/Button/Button';
import Text from '@/Components/Atoms/Text/Text';
import classNames from 'classnames';

interface TwitterButtonProps {
  disabled?: boolean;
  text?: string;
}

const TwitterButton = ({ disabled, text = 'Connect' }: TwitterButtonProps) => {
  return (
    <Button
      className={classNames(
        'bg-[#00ACEE]',
        'flex',
        'items-center',
        'gap-3',
        'h-[30px]',
        disabled && 'opacity-70',
        disabled && 'cursor-not-allowed'
      )}
    >
      <Text color="text-white" fontSize={'16px'} weight="bold" lineHeight="1">
        <TwitterOutlined />
      </Text>
      <Text color="text-white" weight="bold" className="">
        {text}
      </Text>
    </Button>
  );
};

export default TwitterButton;
