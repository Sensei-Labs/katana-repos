export const discord_redirect_uri = process.env.PUBLIC_DISCORD_REDIRECT_URI;
export const discord_client_id = process.env.PUBLIC_DISCORD_CLIENT_ID;
export const discord_client_secret = process.env.DISCORD_CLIENT_SECRET;
export const bot_token = process.env.NEXT_PUBLIC_DISCORD_BOT_TOKEN;

export const PROJECT_GUILD_ID = process.env.APP_PROJECT_GUILD_ID;

export const sensei_token_roles = JSON.parse(process.env.APP_SENSEI_TOKEN_DISCORD_ROLES_ID || '[]') || [];

export const getDiscordLoginUrl = () => {
  const redirect_uri_enc = encodeURIComponent(discord_redirect_uri!);
  const scopes = ['guilds', 'guilds.join', 'guilds.members.read', 'identify', 'email'];

  const scopes_str = scopes.join('%20');
  return `https://discord.com/api/oauth2/authorize?client_id=${discord_client_id}&redirect_uri=${redirect_uri_enc}&response_type=code&scope=${scopes_str}`;
};
