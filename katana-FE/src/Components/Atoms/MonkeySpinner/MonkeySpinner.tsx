type MonkeySpinnerProps = {
  size?: number | string;
};

const MonkeySpinner = ({ size = 220 }: MonkeySpinnerProps) => {
  return (
    <img
      src="/monkey_roll.gif"
      className="object-contain"
      style={{ width: size }}
    />
  );
};

export default MonkeySpinner;
