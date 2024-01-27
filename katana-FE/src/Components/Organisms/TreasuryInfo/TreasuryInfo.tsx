import { Col, Row } from 'antd';
import classNames from 'classnames';
import { Wallet } from 'react-iconly';

import Text from '@/Components/Atoms/Text';
import Title from '@/Components/Atoms/Title';
import Banner from '@/Components/Atoms/Banner';
import { useProjectOne } from '@/Contexts/ProjectOne';
import { CardInfo } from '@/Components/Molecules/Cards';
import SolanaIcon from '@/Components/Atoms/Icons/Solana';
import GridTwoColumn from '@/Components/Atoms/GridColumn';
import WrapperColor from '@/Components/Atoms/WrapperColor';
import { formatMiles, formatMoney } from '@/utils/generalFormat';
import IconWrapper from '@/Components/Atoms/IconWrapper';
import SelectViewsSPLTokens from '@/Components/Organisms/SelectViewsSPLTokens';

const gridClassName = 'py-2 px-3 rounded bg-semi-transparent';

const TreasuryInfo = () => {
  const {
    treasury,
    firstLoading,
    info,
    totalSPLTokenAccount,
    totalAccountBalance,
    SPLBalancesUsd,
    totalBalanceUsd,
    NFTBalances
  } = useProjectOne();

  const description = treasury?.description || '';

  return (
    <>
      <Banner />

      <Row gutter={[20, 20]} className="mb-8">
        <Col xs={12} lg={6}>
          <CardInfo
            convertToUSD
            label="SOL Combined Balance"
            value={totalAccountBalance?.parserNumber || 0}
          />
        </Col>
        <Col xs={12} lg={6}>
          <CardInfo
            icon={
              <IconWrapper
                className="text-corporate"
                style={{ fontSize: '24px', lineHeight: 0 }}
              >
                <Wallet set="bold" />
              </IconWrapper>
            }
            label="Total Token Values"
            subValue={`$${formatMoney(SPLBalancesUsd)} USD`}
            value={
              <span>
                {totalSPLTokenAccount}
                <span className="ml-2 font-black text-sm text-secondaryText2">
                  SPL Tokens
                </span>
              </span>
            }
          />
        </Col>
        <Col xs={12} lg={6}>
          <CardInfo
            convertToUSD
            label="NFTs Value in SOL"
            value={NFTBalances || 0}
          />
        </Col>
        <Col xs={12} lg={6}>
          <CardInfo
            label="Total Treasury Value"
            value={
              <span className="flex items-center gap-1">
                {formatMoney(totalAccountBalance?.parserNumber || 0)}
                <span className="text-[1rem] text-secondaryText2">
                  + {totalSPLTokenAccount}
                </span>
              </span>
            }
            subValue={`$${formatMoney(totalBalanceUsd)} USD`}
          />
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} md={12}>
          <WrapperColor className={classNames('h-full overflow-y-auto')}>
            <Title>About</Title>

            <Text>{description}</Text>
          </WrapperColor>
        </Col>
        <Col xs={24} md={12}>
          <WrapperColor className={classNames('h-full flex flex-col')}>
            <Row gutter={[10, 10]}>
              <Col xs={24} md={12}>
                <GridTwoColumn
                  first="Floor"
                  align="center"
                  loading={firstLoading}
                  className={gridClassName}
                  firstClassName="uppercase"
                  withMarginBottom={false}
                  second={
                    <>
                      <SolanaIcon /> {info.floor_price}
                    </>
                  }
                />
              </Col>
              <Col xs={24} md={12}>
                <GridTwoColumn
                  first="Total Vol"
                  loading={firstLoading}
                  className={gridClassName}
                  firstClassName="uppercase"
                  withMarginBottom={false}
                  second={
                    <>
                      <SolanaIcon /> {formatMiles(info.volume_all)}
                    </>
                  }
                />
              </Col>
              <Col xs={24} md={12}>
                <GridTwoColumn
                  first="Avg. Vol 24h"
                  loading={firstLoading}
                  firstClassName="uppercase"
                  className={gridClassName}
                  withMarginBottom={false}
                  second={
                    <>
                      <SolanaIcon /> {formatMoney(info.volume_24_hours)}
                    </>
                  }
                />
              </Col>
              <Col xs={24} md={12}>
                <GridTwoColumn
                  first="Owners"
                  loading={firstLoading}
                  firstClassName="uppercase"
                  second={info.holders}
                  className={gridClassName}
                  withMarginBottom={false}
                />
              </Col>
              <Col xs={24} md={12}>
                <GridTwoColumn
                  first="Listed"
                  loading={firstLoading}
                  firstClassName="uppercase"
                  second={info.listed}
                  className={gridClassName}
                  withMarginBottom={false}
                />
              </Col>
              <Col xs={24} md={12}>
                <GridTwoColumn
                  first="Total Supply"
                  loading={firstLoading}
                  withMarginBottom={false}
                  className={gridClassName}
                  firstClassName="uppercase"
                  second={formatMiles(info.items)}
                />
              </Col>
              <Col xs={24}>
                <SelectViewsSPLTokens />
              </Col>
            </Row>
          </WrapperColor>
        </Col>
      </Row>
    </>
  );
};

export default TreasuryInfo;
