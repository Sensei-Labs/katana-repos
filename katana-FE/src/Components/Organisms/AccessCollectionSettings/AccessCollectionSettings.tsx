import useToggle from '@/hooks/useToggle';
import Text from '@/Components/Atoms/Text';
import Title from '@/Components/Atoms/Title';
import Button from '@/Components/Atoms/Button';
import { AdminType } from '@/Contexts/Projects';
import IconActions from '@/Components/Atoms/IconActions';
import GridTwoColumn from '@/Components/Atoms/GridColumn';
import { useProjectOne } from '@/Contexts/ProjectOne';
import ListWithActions from '@/Components/Molecules/ListWithActions';
import ModalAddAddress from '@/Components/Molecules/ModalAddAddress';
import { getAccess, ScopeType } from '@/hooks/useRedirectTreasuryAccess';
import {
  addCanBeWriteFromTreasury,
  deleteCanBeWriteFromTreasury
} from '@/fetches/treasury';

const AccessCollectionSettings = () => {
  const { loading, treasury, scopeTreasury } = useProjectOne();
  const [visible, toggleVisible] = useToggle();

  const isCreator = getAccess(scopeTreasury, ScopeType.IS_CREATOR);

  const onDelete = async (id: number) => {
    if (treasury?.id) {
      await deleteCanBeWriteFromTreasury(treasury.id, { id });
    }
  };

  if (!isCreator) return null;

  return (
    <div>
      <GridTwoColumn
        first={
          <div>
            <Title fontFamily="font-sans">Admins</Title>
            <Text>
              Add admins so they can edit project information and tag
              transactions, admins CANNOT add another admin
            </Text>
          </div>
        }
        second={
          <Button
            onClick={toggleVisible}
            bgColor="bg-semi-transparent"
            className="items-center flex"
            icon={<IconActions type="add" />}
          >
            Add
          </Button>
        }
      />

      <ListWithActions<AdminType>
        loading={loading}
        data={treasury?.canBeWrite}
        onDelete={(item) => onDelete(item.id)}
        renderItem={(item) => item?.walletAddress}
      />

      <ModalAddAddress
        isOpen={visible}
        onClose={toggleVisible}
        onFinnish={addCanBeWriteFromTreasury}
      />
    </div>
  );
};

export default AccessCollectionSettings;
