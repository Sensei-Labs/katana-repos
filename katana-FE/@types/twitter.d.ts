declare interface TwitterUser {
  id: string;
  name: string;
  username: string;
}

declare interface TwitterRefreshToken {
  access_token: string;
  tokenType: string;
  expiresIn: number;
  refreshToken: string;
}
