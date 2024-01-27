import classNames from 'classnames';
import { useProjectOne } from '@/Contexts/ProjectOne';
import Select from '@/Components/Atoms/Select';
import CoinIcon from '@/Components/Atoms/Icons/Coin';
import IconWrapper from '@/Components/Atoms/IconWrapper';
import LabelSPLView from '@/Components/Organisms/SelectViewsSPLTokens/LabelSPLView';
import { useMemo } from 'react';

type SelectViewsSPLTokensProps = {
  className?: string;
};

const SelectViewsSPLTokens = ({ className }: SelectViewsSPLTokensProps) => {
  const { SPLTransactions, firstLoading } = useProjectOne();

  const defaultValue = useMemo(() => {
    if (!SPLTransactions.length) return undefined;
    return SPLTransactions[0].mintAddress;
  }, [SPLTransactions]);

  return (
    <Select
      withSearch
      size="large"
      key={defaultValue}
      loading={firstLoading}
      style={{ height: 50 }}
      defaultValue={defaultValue}
      className={classNames('w-full', className)}
      items={SPLTransactions.map((splTransaction) => {
        return {
          label: <LabelSPLView {...splTransaction} />,
          value: splTransaction.mintAddress
        };
      })}
    />
  );
};

export default SelectViewsSPLTokens;
