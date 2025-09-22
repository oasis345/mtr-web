export enum AssetType {
  STOCKS = 'stocks',
  CRYPTO = 'crypto',
}

export enum MarketDataType {
  MOST_ACTIVE = 'mostActive',
  GAINERS = 'gainers',
  LOSERS = 'losers',
  SYMBOL = 'symbol',
  USER_SYMBOLS = 'userSymbols',
}

export interface MarketQueryParams {
  assetType: AssetType; // 주식, 코인
  dataType: MarketDataType; // 시장 데이터 타입
  symbols?: string[]; // 여러 심볼 조회용
  limit?: number; // 제한
  orderBy?: string; // 정렬 순서
}

export interface MarketData {
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changesPercentage: number;
  volume: number;
  marketCap: number;
  timestamp: number;
  previousClose: number;
  assetType: AssetType;
  currency: Currency;
}

// === 통화 포맷 유틸 ===
export enum Currency {
  USD = 'USD',
  KRW = 'KRW',
}

export interface AssetParams {
  assetType: string;
  symbol: string;
}
