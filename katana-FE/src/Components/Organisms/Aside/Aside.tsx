import classNames from 'classnames';

import { ROUTES } from '@/config';
import Subtract from '@/Components/Atoms/Icons/Subtract';
import { useProjectOne } from '@/Contexts/ProjectOne';
import { getAccess, ScopeType } from '@/hooks/useRedirectTreasuryAccess';

import menu, { SettingsKey } from './menu';
import ActiveLink from './ActiveLink';
import { AsideStyle } from './style';

export interface ListProps {
  key: string;
  title: string;
  href: string;
  icon: React.ReactNode;
}

type AsideProps = {
  visible: boolean;
  toggle: () => void;
  list?: ListProps[];
};

const Aside = ({ visible, toggle, list = menu }: AsideProps) => {
  const { scopeTreasury } = useProjectOne();
  const canBeWrite = getAccess(scopeTreasury, ScopeType.CAN_BE_WRITE);

  return (
    <AsideStyle
      className={classNames(
        'hidden lg:block fixed bg-aside',
        'z-20 inset-0 top-[64px] overflow-y-auto',
        'left-0 right-auto py-10 pb-3',
        'transition duration-150 ease-in',
        {
          'w[15rem]': visible,
          'w[5rem]': !visible,
          'px-8': visible,
          'px-3': !visible
        }
      )}
    >
      <nav className="lg:text-sm lg:leading-6 relative h-full relative flex flex-col justify-between">
        <div>
          {list.map(({ title, href, key, icon }) => {
            if (key === SettingsKey && !canBeWrite) return null;
            return (
              <ActiveLink
                key={key}
                href={href}
                icon={icon}
                title={title}
                isOpen={visible}
                className="text-neutral-400 z-10"
                match={
                  href === ROUTES.DASHBOARD.path ? [ROUTES.TREASURIES.path] : []
                }
              />
            );
          })}
        </div>

        <div className="w-full">
          <ActiveLink
            onClick={toggle}
            icon={<Subtract />}
            isOpen={visible}
            title="Toggle sidebar"
            className="text-neutral-400 z-10"
          />
        </div>

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="aside"
          src="/bg-aside.png"
          className="absolute bottom-20 z-0 w-full"
        />
      </nav>
    </AsideStyle>
  );
};

export default Aside;
