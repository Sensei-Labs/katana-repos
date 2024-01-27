import { Tag } from 'antd';
import { useMemo } from 'react';
import classNames from 'classnames';
import { EditSquare } from 'react-iconly';
import type { ColumnsType } from 'antd/es/table';

import useToggle from '@/hooks/useToggle';
import Text from '@/Components/Atoms/Text';
import Button from '@/Components/Atoms/Button';
import Tooltip from '@/Components/Atoms/Tooltip';
import { formatMoney } from '@/utils/generalFormat';
import { InfoCircleFilled } from '@ant-design/icons';
import { useTransactions } from '@/Contexts/Transactions';
import { useProjectOne } from '@/Contexts/ProjectOne';
import { formatDateAgo, formatDateTime } from '@/utils/formatDateTime';
import GenericCurrencyIcon from '@/Components/Atoms/Icons/GenericCurrency';
import { AssetAcceptedEnum, useAssetPrice } from '@/Contexts/AssetPrice';

export const useColumn = (
  toggleModalTransaction?: (id: number) => void,
  selectedRowKeys?: number[] | null,
  isEdit: boolean = false
): ColumnsType<any> => {
  const { getAmountInUsd } = useAssetPrice();
  const { scopeTreasury } = useProjectOne();
  const { pagination } = useTransactions();
  const [showDate, toggleShowDate] = useToggle(false);

  const extraRender = useMemo<ColumnsType<any>>(() => {
    if ((scopeTreasury.canBeWrite || scopeTreasury.isCreator) && isEdit) {
      return [
        {
          title: 'Actions',
          dataIndex: '',
          key: 'operations',
          render: (_: any, record: any) => {
            return (
              <Button
                type="text"
                disabled={!!selectedRowKeys?.length}
                onClick={() =>
                  toggleModalTransaction && toggleModalTransaction(record.id)
                }
                variant="semi-trans"
                icon={<EditSquare set="bold" />}
              />
            );
          }
        }
      ];
    }
    return [];
  }, [
    isEdit,
    selectedRowKeys,
    scopeTreasury.canBeWrite,
    scopeTreasury.isCreator,
    toggleModalTransaction
  ]);

  const calcIndex = () => {
    if (pagination?.meta?.pagination?.page === 1) return 0;
    return (
      (Number(pagination?.meta?.pagination?.page || 0) - 1) *
      (pagination?.meta?.pagination?.pageSize || 0)
    );
  };

  return [
    {
      key: 'key',
      title: '#',
      dataIndex: 'number',
      render: (_, record, index) => <span>#{calcIndex() + index + 1}</span>
    },
    {
      key: 'id',
      title: 'Katana ID',
      dataIndex: 'id',
      render: (value) => <Text style={{ width: 65 }}>{value}</Text>
    },
    {
      key: 'signature',
      title: 'Trx',
      dataIndex: 'signature',
      render: (_) => (
        <Tooltip text={_}>
          <div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://solscan.io/tx/${_}`}
            >
              {_.slice(0, 12)}...
            </a>
          </div>
        </Tooltip>
      )
    },
    {
      title: 'Direction',
      dataIndex: 'direction',
      width: 150,
      sorter: isEdit
        ? {
            multiple: 1
          }
        : undefined,
      render: (value) => {
        const isOut = value === 'OUT';
        return (
          <Text
            className={classNames(
              'rounded-2xl border-2 border-solid text-center w-fit px-4 mx-auto',
              isOut ? 'border-error' : 'border-success'
            )}
            color={isOut ? 'text-error' : 'text-success'}
            weight="bold"
          >
            {value}
          </Text>
        );
      }
    },
    {
      dataIndex: 'date',
      width: 150,
      ellipsis: true,
      key: 'createdAt',
      sorter: isEdit
        ? {
            multiple: 2
          }
        : undefined,
      render: (value) => {
        return showDate ? formatDateTime(value) : formatDateAgo(value);
      },
      title: (
        <div className="flex gap-1" onClick={toggleShowDate}>
          <span>Date {showDate ? '(UTC)' : ''}</span>
          <Tooltip text="Show date" className="cursor-pointer">
            <InfoCircleFilled style={{ fontSize: '12px' }} />
          </Tooltip>
        </div>
      )
    },
    {
      title: 'Category',
      dataIndex: 'tag',
      width: 150,
      key: 'tag.id',
      render: (amount) => {
        if (!amount) return null;
        return <Tag color={amount?.color}>{amount?.name}</Tag>;
      }
    },
    {
      title: 'Asset',
      dataIndex: 'symbol',
      sorter: isEdit
        ? {
            multiple: 3
          }
        : undefined,
      render: (value, record) => {
        return (
          <Text className="flex gap-1 items-center" style={{ width: 80 }}>
            <GenericCurrencyIcon
              size={18}
              symbol={record.symbol}
              url={record.tokenIcon}
            />
            <strong>{record?.symbol}</strong>
          </Text>
        );
      }
    },
    {
      title: 'Wallet From',
      dataIndex: 'fromUserAccount',
      key: 'fromUserAccount',
      render: (value, record) => {
        if (!record?.walletAddressTrack) {
          return <Text>{value}</Text>;
        }
        const wallet = record?.walletAddressTrack;

        return (
          <Tooltip text={wallet?.address}>
            <Tag color={wallet?.color}>{wallet?.label}</Tag>
          </Tooltip>
        );
      }
    },
    {
      title: 'Wallet To',
      width: 200,
      dataIndex: 'toUserAccount',
      key: 'toUserAccount',
      render: (value) => (
        <Tooltip text={value} className="cursor-pointer">
          <div>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={`https://solscan.io/account/${value}`}
            >
              {value.slice(0, 12)}...
            </a>
          </div>
        </Tooltip>
      )
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      sorter: isEdit
        ? {
            multiple: 3
          }
        : undefined,
      render: (value, record) => {
        const { format } = record.amountFormatted;
        const isOut = record.direction === 'OUT';
        return (
          <Text
            color={isOut ? 'text-error' : 'text-success2'}
            style={{ width: 150 }}
          >
            {formatMoney(format, 2, false)}
          </Text>
        );
      }
    },
    {
      title: 'Amount value ($USD)',
      dataIndex: 'amount-usd',
      render: (value, record) => {
        const { amount, usd } = record.amountFormatted;
        const inUsd = getAmountInUsd(
          record?.symbol || AssetAcceptedEnum.SOL,
          amount,
          usd
        );
        return (
          <Text className="tracking-wider" style={{ width: 120 }}>
            ${formatMoney(inUsd)}
          </Text>
        );
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      render(value) {
        return <Text style={{ width: 250 }}>{value}</Text>;
      }
    },
    ...extraRender
  ];
};

export default useColumn;
