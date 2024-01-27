export default function GenericCurrencyIcon({
  symbol,
  url,
  size = 14,
  ...props
}: {
  symbol: string;
  url: string;
  size?: number;
}) {
  return (
    <img
      height={size}
      width={size}
      {...props}
      src={url || `/images/tokens/${symbol}.svg`}
      alt=""
    />
  );
}
