// packages/services/src/service/auth/tokenProvider.ts
export type TokenData = {
  accessToken: string;
  refreshToken?: string;
};

export abstract class TokenProvider {
  abstract getTokens(): Promise<TokenData | null>;
  setTokens?(tokens: TokenData): void;
  removeTokens?(): void;
}
