import { FC } from 'react';
import Head from 'next/head';
import Title, { FontFamily } from '@/Components/Atoms/Title';

interface TitleSeoProps {
  children?: string;
  fontFamily?: FontFamily;
  lineHeight?: string | number;
}

const TitleSeo: FC<TitleSeoProps> = ({ children, fontFamily, lineHeight }) => {
  const title = `Katana - ${children}`;
  return (
    <>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Title
        level="h1"
        transform="uppercase"
        fontFamily={fontFamily}
        lineHeight={lineHeight}
      >
        {children}
      </Title>
    </>
  );
};

export default TitleSeo;
