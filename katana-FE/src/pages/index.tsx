import React from 'react';
import classNames from 'classnames';

import Text from '@/Components/Atoms/Text';
import { PublicLayout } from '@/Components/Organisms/Layout';
import BackgroundPage from '@/Components/Atoms/BackgroundPage';
import ConnectWallet from '@/Components/Templates/ConnectWallet';

const HomePage = () => {
  return (
    <PublicLayout>
      <BackgroundPage
        className={classNames([
          'flex flex-col items-center justify-start min-h-screen'
        ])}
      >
        <ConnectWallet
          className="mt-52"
          title="Connect with Discord"
          description={
            <div>
              <Text color="text-white text-center">
                In order to continue you must have a role in Discord Server{' '}
                <a href="#" className="block text-blue-400 text-center mt-5">
                  Don&apos;t have one yet?
                </a>
              </Text>
            </div>
          }
        />
      </BackgroundPage>
    </PublicLayout>
  );
};

export default HomePage;
