import Link from 'next/link';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import { forwardRef, ReactNode, useMemo } from 'react';

import { ItemStyle } from './style';

type ActiveLinkProps = {
  className?: string;
  icon: ReactNode;
  title: string;
  match?: string[];
  href?: string;
  isOpen: boolean;
  onClick?: () => void;
  isActive?: boolean;
};

const Item = forwardRef<HTMLAnchorElement, ActiveLinkProps>(
  ({ onClick, className, isActive, icon, isOpen, title }, _ref) => {
    return (
      <ItemStyle
        ref={_ref}
        onClick={onClick}
        title={title}
        className={classNames(
          'transition-colors duration-500 rounded-xl text-text dark:text-white mb-3 select-none',
          `hover:bg-brand hover:rounded-xl hover:opacity-100 cursor-pointer`,
          'active:scale-95',
          isOpen && 'is-open',
          isActive && `bg-brand opacity-100 text-white`,
          className
        )}
      >
        {icon}{' '}
        <span className={classNames(isOpen ? '' : 'hidden')}>{title}</span>
      </ItemStyle>
    );
  }
);

Item.displayName = 'Item';

const ActiveLink = forwardRef<
  HTMLAnchorElement,
  Omit<ActiveLinkProps, 'isActive'>
>((props, _ref) => {
  const { onClick, match = [], href = '', className = '' } = props;
  const { pathname, query } = useRouter();

  const isActive = useMemo(() => {
    const [href1] = pathname.split('?');
    const [href2] = href1.split('#');
    if (href2 && match.length) {
      if (match.includes(href2)) return true;
    }

    if (
      href === '/treasuries/[address]/governance' &&
      pathname === '/treasuries/[address]/governance/[id]'
    )
      return true;

    return href2 === href;
  }, [href, match, pathname]);

  if (onClick) {
    return <Item {...props} isActive={isActive} className={className} />;
  }

  const prepareHref = () => {
    if (href.includes('[address]')) {
      if (!query?.address) return '';
      return href.replace('[address]', (query?.address as string) || '');
    }
    return href;
  };

  return (
    <Link ref={_ref} href={prepareHref()} passHref className="no-underline">
      <Item {...props} isActive={isActive} className={className} />
    </Link>
  );
});

ActiveLink.displayName = 'ActiveLink';

export default ActiveLink;
