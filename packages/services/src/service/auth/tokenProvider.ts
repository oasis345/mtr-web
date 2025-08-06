export type TokenData = {
  accessToken: string;
  refreshToken?: string;
};

export interface TokenProvider<T = Promise<TokenData | null> | TokenData | null> {
  getTokens(): T;
  setTokens?(tokens: TokenData): void;
  removeTokens?(): void;
}
