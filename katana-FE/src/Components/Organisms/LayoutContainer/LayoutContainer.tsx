import { ReactNode, useMemo } from 'react';

import Aside from '@/Components/Organisms/Aside';
// import Footer from '@/Components/Footer';
import { WrapperStyle, ContentStyle, BodyStyle } from './style';
import useToggle from '@/hooks/useToggle';
import classNames from 'classnames';
import Container from '@/Components/Atoms/Container';
import useWindowResize from '@/hooks/useWindowResize';
import { useRouter } from 'next/router';
import { BASE_DOJO_PATH, BASE_PATH_PROJECT_DETAILS } from '@/config';
import { ListProps } from '@/Components/Organisms/Aside/Aside';

type LayoutProps = {
  children?: ReactNode;
  hasAside: boolean;
  withContainer: boolean;
  size?: 'default' | 'small';
  list?: ListProps[];
  css?: any;
};

const LayoutContainer = ({
  children,
  hasAside,
  withContainer,
  size,
  list,
  ...props
}: LayoutProps) => {
  // const windowSize = useWindowResize();
  const { pathname } = useRouter();
  const [visible, toggle] = useToggle(true, 'aside-visible');

  const Component = useMemo(() => {
    // eslint-disable-next-line react/display-name
    if (!withContainer) return (props: any) => <div {...props} />;
    return Container;
  }, [withContainer]);

  const isDetailProject = useMemo(() => {
    if (!pathname) return false;
    return pathname.includes(BASE_PATH_PROJECT_DETAILS);
  }, [pathname]);

  const isDojo = useMemo(() => {
    if (!pathname) return false;
    return pathname.includes(BASE_DOJO_PATH);
  }, [pathname]);

  return (
    <WrapperStyle
      className={classNames([
        'relative max-w-8xl mx-auto px-0',
        {
          'md:pl-[212px]': visible && (isDetailProject || isDojo),
          'md:pl-[73px]': !visible && (isDetailProject || isDojo)
        }
      ])}
      {...props}
    >
      {hasAside && <Aside list={list} visible={visible} toggle={toggle} />}

      <Component
        className={classNames({
          'container mx-auto': !hasAside
        })}
      >
        <ContentStyle $size={size} className="pt-5">
          {children}
          <div className="h-20" />

          {/*<Footer className="rounded p-4" completeFooter={false} />*/}
        </ContentStyle>
      </Component>
    </WrapperStyle>
  );
};

export default LayoutContainer;
