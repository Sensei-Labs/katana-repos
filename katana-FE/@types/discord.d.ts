declare interface DiscordUser {
  accent_color: string | null;
  avatar: string | null;
  discriminator: '6023';
  display_name: string | null;
  email: string;
  global_name: string | null;
  id: string;
  locale: string;
  mfa_enabled: boolean;
  username: string;
  verified: boolean;
}

declare interface DiscordTags {
  bot_id: string | null;
  integration_id: string | null;
  premium_subscriber: boolean;
  subscription_listing_id: string | null;
  available_for_purchase: boolean;
}

declare interface DiscordRole {
  id: string;
  name: string;
  color: number;
  hoist: boolean;
  icon: string;
  unicode_emoji: string;
  position: number;
  permissions: string;
  managed: boolean;
  mentionable: boolean;
  tags: string;
}

declare interface DiscordGuildMember {
  user: DiscordUser;
  nick: string;
  avatar: string;
  roles: string[];
  joined_at: string;
  premium_since: string;
  deaf: boolean;
  mute: boolean;
  flags: number;
  pending: boolean;
  permissions: string;
  communication_disabled_until: string;
}

declare interface RefreshDiscordToken {
  access_token: string;
  tokenType: string;
  expiresIn: number;
  refresh_token: string;
}
