import { ChartTimeframe } from './timeFrame';

export enum AssetType {
  STOCKS = 'stocks',
  CRYPTO = 'crypto',
}

export enum MarketDataType {
  ASSETS = 'assets',
  MOST_ACTIVE = 'mostActive',
  GAINERS = 'gainers',
  LOSERS = 'losers',
  SYMBOL = 'symbol',
  TOP_TRADED = 'topTraded',
  CANDLES = 'candles',
  TRADES = 'trades',
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
  changePercentage: number;
  volume: number;
  marketCap: number;
  timestamp: number;
  previousClose: number;
  assetType: AssetType;
  currency: Currency;
  logo?: string;
}

export enum MarketStreamDataType {
  TICKER = 'ticker',
  TRADE = 'trade',
  CANDLE = 'candle',
}

export interface MarketStreamData<T = Candle | Trade | MarketData> {
  dataType: MarketStreamDataType;
  payload: T;
}

// === 통화 포맷 유틸 ===
export enum Currency {
  USD = 'USD',
  KRW = 'KRW',
}

export interface AssetQueryParams {
  assetType: AssetType; // 주식, 코인
  dataType: MarketDataType; // 시장 데이터 타입
  symbols?: string[]; // 여러 심볼 조회용
  limit?: number; // 제한
  orderBy?: string; // 정렬 순서
}

export interface CandleQueryParams extends AssetQueryParams {
  start?: string; // 시작 시간
  end?: string; // 종료 시간
  timeframe?: ChartTimeframe; // 시간대
}

export interface CandleResponse {
  candles: Candle[];
  nextDateTime: string;
}

export interface Candle {
  currency: Currency;
  assetType: AssetType;
  changePercentage?: number;
  /**
   * 종목을 식별하는 심볼 (e.g., 'TSLA', 'BTC/KRW')
   */
  symbol: string;

  /**
   * 캔들이 시작된 시점의 가격 (from Alpaca's 'o')
   */
  open: number;

  /**
   * 캔들 기간 동안의 최고가 (from Alpaca's 'h')
   */
  high: number;

  /**
   * 캔들 기간 동안의 최저가 (from Alpaca's 'l')
   */
  low: number;

  /**
   * 캔들이 마감된 시점의 가격 (from Alpaca's 'c')
   */
  close: number;

  /**
   * 캔들 기간 동안의 총 거래량 (from Alpaca's 'v')
   */
  volume: number;

  /**
   * 캔들의 타임스탬프 (ISO 8601 형식의 문자열) (from Alpaca's 't')
   */
  timestamp: string;

  /**
   * (선택사항) 캔들 기간 동안의 총 거래 체결 건수 (from Alpaca's 'n')
   */
  tradeCount?: number;
}

export interface Trade {
  id: string;
  timestamp: number;
  price: number;
  change: number;
  changePercentage: number;
  volume: number;
  symbol: string;
  assetType: AssetType;
  currency: Currency;
  side: 'buy' | 'sell';
}

export function isTrade(streamData: MarketStreamData): streamData is MarketStreamData<Trade> {
  return streamData.dataType === MarketStreamDataType.TRADE;
}

export function isCandle(streamData: MarketStreamData): streamData is MarketStreamData<Candle> {
  return streamData.dataType === MarketStreamDataType.CANDLE;
}

export function isTicker(streamData: MarketStreamData): streamData is MarketStreamData<MarketData> {
  return streamData.dataType === MarketStreamDataType.TICKER;
}
