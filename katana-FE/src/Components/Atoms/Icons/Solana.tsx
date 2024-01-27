export default function SolanaIcon(props: any) {
  return (
    <img
      style={{ width: '1em', height: '1em', ...props?.style }}
      {...props}
      src="/icons/sol.svg"
      alt=""
    />
  );
}
