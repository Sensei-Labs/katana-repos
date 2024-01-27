import { useRouter } from 'next/router';
import { useEffect, useMemo } from 'react';
import { mutate } from 'swr';

import Container from '@/Components/Atoms/Container/Container';
import Layout from '@/Components/Organisms/Layout/Layout';

import { completeTwitterAuth } from '@/fetches/twitter';
import { completeDiscordAuth } from '@/fetches/discord';

const discord_client_id = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
const discord_redirect_uri = process.env.NEXT_PUBLIC_DISCORD_REDIRECT_URI;

const twitter_redirect_uri = process.env.NEXT_PUBLIC_TWITTER_REDIRECT_URI;
const twitter_client_id = process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID;
const getDiscordUrl = () => {
  const redirect_uri_enc = encodeURI(discord_redirect_uri!);
  const scopes = [
    'guilds',
    'guilds.join',
    'guilds.members.read',
    'identify',
    'email'
  ];

  const scopes_str = scopes.join('%20');
  return `https://discord.com/api/oauth2/authorize?client_id=${discord_client_id}&redirect_uri=${redirect_uri_enc}&response_type=code&scope=${scopes_str}`;
};

const DISCORD_LOGIN_URL = getDiscordUrl();

const getTwitterUrl = () => {
  const redirect_to = encodeURI('/');
  const redirect_uri_enc = encodeURI(twitter_redirect_uri!);
  const scopes = ['tweet.read', 'users.read', 'follows.read', 'offline.access'];
  const scopes_str = scopes.join('%20');

  return `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${twitter_client_id}&redirect_uri=${redirect_uri_enc}&scope=${scopes_str}&state=${redirect_to}&code_challenge=challenge&code_challenge_method=plain`;
};

const TWITTER_LOGIN_URL = getTwitterUrl();

const checkCode = (
  app: string,
  code: string,
  push: (url: string) => Promise<boolean>
) => {
  if (app === 'discord') {
    if (!code) return push(DISCORD_LOGIN_URL);
    completeDiscordAuth(code).then(async (res) => {
      await mutate('/users/me?populate=user_tags');
      if (res.status === 200) push('/treasuries');
    });
  }

  if (app === 'twitter') {
    if (!code) push(TWITTER_LOGIN_URL);
    completeTwitterAuth(code).then(async (res) => {
      await mutate('/users/me?populate=user_tags');
      if (res.status === 200) push('/treasuries');
    });
  }
};

const Oauth = () => {
  const { query, push } = useRouter();

  const app = useMemo(() => query?.app as string, [query?.app]);
  const code = useMemo(() => query?.code as string, [query?.code]);

  useEffect(() => {
    checkCode(app, code, push);
  }, [app, code, push]);

  return (
    <Layout size="small">
      <Container className="flex justify-center items-center mt-[220px]">
        {code && <h2>Doing authorization process</h2>}
        {!code && <h2>Redirecting to {app} login page</h2>}
      </Container>
    </Layout>
  );
};

export default Oauth;
