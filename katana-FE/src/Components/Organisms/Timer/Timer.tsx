import { useEffect, useState } from 'react';
import Text from '@/Components/Atoms/Text';
import ClockIcon from '@/Components/Atoms/Icons/Clock';

interface TimerProps {
  deadline: string;
}

const Timer = ({ deadline }: TimerProps) => {
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    const targetDate = new Date(deadline);

    const intervalId = setInterval(() => {
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      setCountdown(
        `${days < 10 ? '0' : ''}${days}d ${hours < 10 ? '0' : ''}${hours}h ${
          minutes < 10 ? '0' : ''
        }${minutes}m`
      );
    }, 1000);

    return () => clearInterval(intervalId); // This clears the interval when the component unmounts
  }, [deadline]);
  return (
    <div className="mt-2">
      <Text
        className="bg-background px-2 py-2 rounded-md w-[fit-content] flex gap-2 items-center"
        fontSize={16}
      >
        <ClockIcon /> {countdown}
      </Text>
    </div>
  );
};

export default Timer;
