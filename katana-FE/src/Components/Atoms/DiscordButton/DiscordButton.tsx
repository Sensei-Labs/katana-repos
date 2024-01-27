import Button from '@/Components/Atoms/Button/Button';
import Discord from '@/Components/Atoms/Icons/Discord';
import Text from '@/Components/Atoms/Text/Text';
import classNames from 'classnames';

interface DiscordButtonProps {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  disabled?: boolean;
  text?: string;
  onClick?: () => void;
}

const DiscordButton = ({
  textClassName,
  iconClassName,
  className,
  disabled,
  text = 'Connect',
  onClick
}: DiscordButtonProps) => {
  return (
    <Button
      onClick={onClick}
      className={classNames(
        'bg-[#5865F2]',
        'flex',
        'items-center',
        'gap-3',
        'h-[30px]',
        disabled && 'opacity-70',
        disabled && 'cursor-not-allowed',
        className
      )}
    >
      <div className={iconClassName}>
        <Discord />
      </div>

      <div className={textClassName}>{text}</div>
    </Button>
  );
};

export default DiscordButton;
