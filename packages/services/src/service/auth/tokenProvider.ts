// packages/services/src/service/auth/tokenProvider.ts
export abstract class TokenProvider {
  abstract getTokens(): Promise<{ accessToken: string; refreshToken?: string } | null>;
  setTokens?(tokens: { accessToken: string; refreshToken?: string }): void;
  removeTokens?(): void;
}
