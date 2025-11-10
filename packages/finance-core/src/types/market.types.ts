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
  SYMBOLS = 'symbols',
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

export enum MarketStreamDataType {
  TICKER = 'ticker',
  TRADE = 'trade',
  CANDLE = 'candle',
}

export interface MarketStreamData<T = Candle | Trade | TickerData> {
  dataType: MarketStreamDataType;
  payload: T;
}

// === 통화 포맷 유틸 ===
export enum Currency {
  USD = 'USD',
  KRW = 'KRW',
}

export enum StockMarketStatus {
  'REGULAR' = '정규 거래시간',
  'PRE' = '해외 프리마켓',
  'AFTER' = '해외 애프터마켓',
  'CLOSE' = '정규 휴무 시간',
}

export interface ExchangeRate {
  usd: number;
  krw: number;
  timestamp: string;
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

export interface Asset {
  assetType: AssetType;
  symbol: string;
  name?: string;
  exchange?: string;
  currency?: Currency;
  logo?: string;
}

export type BaseTickerData = {
  price: number;
  change: number;
  changePercentage: number;
  volume?: number;
  timestamp?: number;
  previousClose?: number;
  accTradeVolume?: number;
  accTradePrice?: number;
};
export type TickerData<T extends Asset = Asset> = T & BaseTickerData;

export interface Candle extends Asset {
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  timestamp: string;
  tradeCount?: number;
  change?: number;
  changePercentage?: number;
  candleAccTradePrice?: number;
  candleAccTradeVolume?: number;
}

export interface Trade extends Asset {
  id: string;
  timestamp: number;
  price: number;
  change: number;
  changePercentage: number;
  volume: number;
  side: 'buy' | 'sell';
}

export interface Quote extends Asset {
  ask: number;
  askSize: number;
  askPrice: number;
  askTotalSize: number;
  bid: number;
  bidSize: number;
  bidPrice: number;
  bidTotalSize: number;
  timestamp: number;
}

export function isTrade(streamData: MarketStreamData): streamData is MarketStreamData<Trade> {
  return streamData.dataType === MarketStreamDataType.TRADE;
}

export function isCandle(streamData: MarketStreamData): streamData is MarketStreamData<Candle> {
  return streamData.dataType === MarketStreamDataType.CANDLE;
}

export function isTicker(streamData: MarketStreamData): streamData is MarketStreamData<TickerData> {
  return streamData.dataType === MarketStreamDataType.TICKER;
}
