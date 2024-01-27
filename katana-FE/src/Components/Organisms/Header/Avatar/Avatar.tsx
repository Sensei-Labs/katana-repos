import { Avatar as AvatarAntd, Button, Dropdown } from 'antd';
import { useScope } from '@/Contexts/Scope';
import useToggle from '@/hooks/useToggle';
import ModalFormAccount from '@/Components/Organisms/Header/Avatar/ModalFormAccount';

export default function Avatar() {
  const { user, onLogout } = useScope();
  const [open, toggleOpen] = useToggle();

  return (
    <>
      <Dropdown
        arrow
        className="ml-2"
        trigger={['click']}
        placement="bottomRight"
        menu={{
          items: [
            {
              key: 'account',
              label: (
                <Button
                  onClick={toggleOpen}
                  className="w-full border-[0px] bg-transparent shadow-none"
                >
                  Account
                </Button>
              )
            },
            {
              key: 'disconnect',
              label: (
                <Button
                  onClick={onLogout}
                  className="w-full border-[0px] bg-transparent shadow-none"
                >
                  Disconnect
                </Button>
              )
            }
          ]
        }}
      >
        <AvatarAntd size="large" src={user?.avatar || ''} />
      </Dropdown>

      <ModalFormAccount key={`open-${open}`} open={open} onClose={toggleOpen} />
    </>
  );
}
