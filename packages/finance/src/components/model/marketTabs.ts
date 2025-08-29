import { MarketDataTypeTab, MarketTab, TimeRangeTab } from '../types/tabs';

export const MARKET_ASSETS: MarketTab[] = [
  { label: '주식', value: 'stock' },
  { label: '코인', value: 'crypto' },
];
export const MARKET_DATA_TYPES: MarketDataTypeTab[] = [
  { label: '시가총액', value: 'marketCap' },
  { label: '거래량', value: 'volume' },
  { label: '상승종목', value: 'gainers' },
  { label: '하락종목', value: 'losers' },
];

export const TIME_RANGES: TimeRangeTab[] = [
  { label: '실시간', value: 'realtime' },
  { label: '1일', value: '1d' },
  { label: '1주일', value: '1w' },
  { label: '1개월', value: '1m' },
  { label: '3개월', value: '3m' },
  { label: '1년', value: '1y' },
];
