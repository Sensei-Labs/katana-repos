export interface DiscordAccessTokenResults {
  token_type: string;
  access_token: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

/*
"token_type": "Bearer",
"access_token": "81au5rZMbCQEUu0agltwr16GOozdal",
"expires_in": 604800,
"refresh_token": "qy0HOsxSQw77PleQGy55Go0xZVB3HN",
"scope": "identify email guilds.members.read guilds guilds.join"
*/

export interface DiscordServerRole {
  id: string;
  name: string;
  description: string | null;
  permissions: string;
  position: number;
  color: number;
  hoist: boolean;
  managed: boolean;
  mentionable: boolean;
  icon: string | null;
  unicode_emoji: string | null;
  flags: number;
}

/*
"id": "945960787984396309",
"name": "@everyone",
"description": null,
"permissions": "111022861307457",
"position": 0,
"color": 0,
"hoist": false,
"managed": false,
"mentionable": false,
"icon": null,
"unicode_emoji": null,
"flags": 0
*/

export interface DiscordCurrentUser {
  id: string;
  username: string;
  global_name: string;
  avatar: string;
  discriminator: string;
  public_flags: number;
  flags: number;
  banner: string | null;
  banner_color: string | null;
  accent_color: string | null;
  locale: string;
  mfa_enabled: boolean;
  premium_type: number;
  avatar_decoration: string | null;
  email: string;
  verified: boolean;
}

export interface DiscordGuildPartialInfo {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
  permissions: string;
  features: string[];
  approximate_member_count: number;
  approximate_presence_count: number;
}

/*
"id": "953132700838023219",
"username": "rodjosh",
"global_name": "Joshua Medrano",
"avatar": "b89bd69806c6484ce5e214942a46960b",
"discriminator": "0",
"public_flags": 0,
"flags": 0,
"banner": null,
"banner_color": null,
"accent_color": null,
"locale": "en-US",
"mfa_enabled": false,
"premium_type": 0,
"avatar_decoration": null,
"email": "joshua.medrano@oowlish.com",
"verified": true
*/

export interface DiscordGuildMemberInfo {
  avatar: string | null;
  communication_disabled_until: string | null;
  flags: number;
  joined_at: string;
  nick: string | null;
  pending: boolean;
  premium_since: string | null;
  roles: string[];
  user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    public_flags: number;
    flags: number;
    banner: string | null;
    accent_color: string | null;
    global_name: string;
    avatar_decoration: string | null;
    display_name: string;
    banner_color: string | null;
  };
  mute: boolean;
  deaf: boolean;
}

/*
"avatar": null,
"communication_disabled_until": null,
"flags": 0,
"joined_at": "2023-04-25T19:57:32.603000+00:00",
"nick": null,
"pending": false,
"premium_since": null,
"roles": [
    "945962647143211068"
],
"user": {
    "id": "953132700838023219",
    "username": "rodjosh",
    "avatar": "b89bd69806c6484ce5e214942a46960b",
    "discriminator": "0",
    "public_flags": 0,
    "flags": 0,
    "banner": null,
    "accent_color": null,
    "global_name": "Joshua Medrano",
    "avatar_decoration": null,
    "display_name": "Joshua Medrano",
    "banner_color": null
},
"mute": false,
"deaf": false
*/
