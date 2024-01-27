import Link from 'next/link';
import { useMemo } from 'react';
import { Ticket } from 'react-iconly';
import { Card, Col, Empty, Row, Tag } from 'antd';
import useSWR from 'swr';

import Image from '@/Components/Atoms/Image/Image';
import Text from '@/Components/Atoms/Text/Text';
import Title from '@/Components/Atoms/Title';
import Tooltip from '@/Components/Atoms/Tooltip/Tooltip';
import TooltipContent from '@/Components/Molecules/Cards/TooltipContent';
import Layout from '@/Components/Organisms/Layout';
import { dojoAsideList } from '@/Components/Organisms/Aside/menu';

import { ROUTES } from '@/config';
import { fetcher } from '@/services/api';
import { API_ROUTES } from '@/config/api';
import { UserInfo } from '@/Contexts/Scope/types';

interface AuctionItemProps {
  id: number;
  title: string;
  details: string;
  price: number;
  user: UserInfo;
  thumbnail: string;
  type: 'nft' | 'whitelist';
}

interface AuctionListProps {
  data: AuctionItemProps[];
}

const Auction = () => {
  const { data: itemsList, isLoading: listLoading } = useSWR<AuctionListProps>(
    API_ROUTES.GET_AUCTION_ITEMS.path,
    fetcher
  );

  const nftList = useMemo(() => {
    return itemsList?.data.filter((item) => item.type === 'nft');
  }, [itemsList]);

  const whiteList = useMemo(() => {
    return itemsList?.data.filter((item) => item.type === 'whitelist');
  }, [itemsList]);

  return (
    <Layout list={dojoAsideList}>
      <Card className="h-full rounded-3xl overflow-hidden px-8 mt-10">
        <div className="flex justify-start items-center gap-5 ">
          <Ticket set="bold" />
          <Title fontSize={20} fontFamily="font-mono" isBold withMargin={false}>
            Auction
          </Title>
        </div>
      </Card>
      <Card className="h-full rounded-3xl overflow-hidden px-8 py-4 mt-10">
        <Title fontSize={18} fontFamily="font-mono" isBold>
          NFT Auction ({nftList?.length || 0} items available)
        </Title>
        <Row gutter={[20, 20]} className="gap-x-[20px]">
          {nftList &&
            nftList.map((item, index) => (
              <Col xs={12} sm={8} md={8} lg={7} key={item.id}>
                <Link passHref href={`${ROUTES.AUCTION.path}/${item.id}`}>
                  <Tooltip
                    overlayClassName="w-[350px] max-w-full"
                    text={
                      <TooltipContent
                        name={item.user.nickName || 'Anonymous'}
                        description={item.details}
                      />
                    }
                  >
                    <div className="bg-card rounded-3xl cursor-pointer max-w-full">
                      <div className="relative bg-cardImageBackground rounded-t-3xl rounded-b-lg">
                        <Image
                          src={item.thumbnail}
                          width="100%"
                          objectFit="cover"
                          imageClass="rounded-t-3xl rounded-b-lg"
                          height={300}
                        />

                        <div className="absolute top-0 left-0 w-full px-0 py-2">
                          <div className="flex gap-2 justify-end my-1">
                            <Tag
                              key={`tag-${index}`}
                              color="cyan"
                              className="py-1 px-2 rounded-md capitalize"
                            >
                              {item.type}
                            </Tag>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 pb-5 max-w-full">
                        <div className="px-4">
                          <Text
                            className="font-sans"
                            withMargin={false}
                            weight="bold"
                            fontSize={20}
                          >
                            {item.title}
                          </Text>
                          <Text withMargin={false} color="text-brand">
                            {item.price} $
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                </Link>
              </Col>
            ))}

          {!nftList?.length && (
            <Empty
              className="m-auto pt-5"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Row>
      </Card>
      <Card className="h-full rounded-3xl overflow-hidden px-8 py-4 mt-10">
        <Title fontSize={18} fontFamily="font-mono" isBold>
          Whitelist Auction ({whiteList?.length || 0} items available)
        </Title>
        <Row gutter={[20, 20]} className="gap-x-[20px]">
          {whiteList &&
            whiteList.map((item, index) => (
              <Col xs={12} sm={8} md={8} lg={7} key={item.id}>
                <Link passHref href={`${ROUTES.AUCTION.path}/${item.id}`}>
                  <Tooltip
                    overlayClassName="w-[350px] max-w-full"
                    text={
                      <TooltipContent
                        name={item.user.nickName || 'Anonymous'}
                        description={item.details}
                      />
                    }
                  >
                    <div className="bg-card rounded-3xl cursor-pointer max-w-full">
                      <div className="relative bg-cardImageBackground rounded-t-3xl rounded-b-lg">
                        <Image
                          src={item.thumbnail}
                          width="100%"
                          objectFit="cover"
                          imageClass="rounded-t-3xl rounded-b-lg"
                          height={300}
                        />

                        <div className="absolute top-0 left-0 w-full px-0 py-2">
                          <div className="flex gap-2 justify-end my-1">
                            <Tag
                              key={`tag-${index}`}
                              color="cyan"
                              className="py-1 px-2 rounded-md capitalize"
                            >
                              {item.type}
                            </Tag>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 pb-5 max-w-full">
                        <div className="px-4">
                          <Text
                            className="font-sans"
                            withMargin={false}
                            weight="bold"
                            fontSize={20}
                          >
                            {item.title}
                          </Text>
                          <Text withMargin={false} color="text-brand">
                            {item.price} $
                          </Text>
                        </div>
                      </div>
                    </div>
                  </Tooltip>
                </Link>
              </Col>
            ))}

          {!whiteList?.length && (
            <Empty
              className="m-auto pt-5"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          )}
        </Row>
      </Card>
    </Layout>
  );
};

export default Auction;
