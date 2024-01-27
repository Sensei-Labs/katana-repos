import { PropsWithChildren } from 'react';
import { PublicHeader } from '@/Components/Organisms/Header';

type LayoutProps = {};

const PublicLayout = ({ children }: PropsWithChildren<LayoutProps>) => {
  return (
    <div>
      <PublicHeader />
      {children}
    </div>
  );
};

export default PublicLayout;
