import { AssetQueryParams, CandleResponse, MarketData } from './market.types';

export interface FinancialService {
  getAssets: (params: AssetQueryParams) => Promise<MarketData[]>;
  getCandles: (params: AssetQueryParams) => Promise<CandleResponse>;
}

export * from './timeFrame';
export * from './market.types';
