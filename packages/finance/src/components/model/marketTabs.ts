import {
  AssetType,
  MarketDataType,
  ChartTimeframe,
  ChartShortTimeframe,
  ChartLongTimeframe,
  MarketTab,
  MarketDataTypeTab,
} from '../../types';

export const MARKET_ASSETS: MarketTab[] = [
  { label: '주식', value: AssetType.STOCKS },
  { label: '코인', value: AssetType.CRYPTO },
];

export const MARKET_DATA_TYPES: MarketDataTypeTab[] = [
  { label: '인기종목', value: MarketDataType.MOST_ACTIVE },
  { label: '상승종목', value: MarketDataType.GAINERS },
  { label: '하락종목', value: MarketDataType.LOSERS },
];

export const MARKET_SYMBOL_DATA_TYPES: MarketDataTypeTab[] = [
  { label: '티커', value: MarketDataType.SYMBOL },
  { label: '사용자 종목', value: MarketDataType.USER_SYMBOLS },
];

export const TIME_RANGES_MAP: { label: string; value: ChartTimeframe }[] = [
  { label: '실시간', value: ChartTimeframe.REALTIME },
  { label: '1일', value: ChartTimeframe.ONE_DAY },
  { label: '1주일', value: ChartTimeframe.ONE_WEEK },
  { label: '1개월', value: ChartTimeframe.ONE_MONTH },
  { label: '1년', value: ChartTimeframe.ONE_YEAR },
];

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
