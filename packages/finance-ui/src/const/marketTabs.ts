import { AssetType, ChartLongTimeframe, ChartShortTimeframe, Currency, MarketDataType } from '@mtr/finance-core';
import { MarketDataTypeTab, MarketPriceTab, MarketTab } from '../types';

export const MARKET_ASSETS_MAP: MarketTab[] = [
  { label: '주식', value: AssetType.STOCKS },
  { label: '코인', value: AssetType.CRYPTO },
];

export const MARKET_PRICE_TABS_MAP: MarketPriceTab[] = [
  { label: '실시간', value: 'realTime' },
  { label: '일별', value: 'daily' },
];

export const MARKET_DATA_MAP: MarketDataTypeTab[] = [
  { label: '거래량', value: MarketDataType.MOST_ACTIVE },
  { label: '거래대금', value: MarketDataType.TOP_TRADED },
  { label: '급상승', value: MarketDataType.GAINERS },
  { label: '급하락', value: MarketDataType.LOSERS },
];

// export const MARKET_SYMBOL_DATA_MAP: MarketDataTypeTab[] = [
//   { label: '티커', value: MarketDataType.SYMBOL },
//   { label: '사용자 종목', value: MarketDataType.USER_SYMBOLS },
// ];

export const CHART_SHORT_TIMEFRAMES_MAP: { label: string; value: ChartShortTimeframe }[] = [
  { label: '1분', value: ChartShortTimeframe.ONE_MINUTE },
  { label: '3분', value: ChartShortTimeframe.THREE_MINUTES },
  { label: '5분', value: ChartShortTimeframe.FIVE_MINUTES },
  { label: '10분', value: ChartShortTimeframe.TEN_MINUTES },
  { label: '30분', value: ChartShortTimeframe.THIRTY_MINUTES },
  { label: '60분', value: ChartShortTimeframe.ONE_HOUR },
];

export const CHART_LONG_TIMEFRAMES_MAP: { label: string; value: ChartLongTimeframe }[] = [
  { label: '1일', value: ChartLongTimeframe.ONE_DAY },
  { label: '1주일', value: ChartLongTimeframe.ONE_WEEK },
  { label: '1개월', value: ChartLongTimeframe.ONE_MONTH },
  { label: '1년', value: ChartLongTimeframe.ONE_YEAR },
];

export const CURRENCY_MAP: { label: string; value: Currency }[] = Object.values(Currency).map(currency => ({
  label: currency,
  value: currency,
}));
