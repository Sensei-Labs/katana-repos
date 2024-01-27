import * as Icons from 'react-iconly';

export const RenderIconFromKey = ({
  name,
  ...rest
}: BaseComponent & { name: string }) => {
  // @ts-ignore
  const Component = Icons[name];

  if (Component === undefined) return null;
  return <Component {...rest} />;
};
