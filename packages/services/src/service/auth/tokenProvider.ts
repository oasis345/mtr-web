export type TokenData = {
  accessToken: string;
  refreshToken?: string;
};

export interface TokenProvider {
  getTokens(): Promise<TokenData | null>;
  setTokens?(tokens: TokenData): void;
  removeTokens?(): void;
}
