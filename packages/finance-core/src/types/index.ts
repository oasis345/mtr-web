import { AssetQueryParams, CandleResponse, MarketData, Trade } from './market.types';

export interface FinancialService {
  getAssets: (params: AssetQueryParams) => Promise<MarketData[]>;
  getCandles: (params: AssetQueryParams) => Promise<CandleResponse>;
  getTrades: (params: AssetQueryParams) => Promise<Trade[]>;
}

export * from './timeFrame';
export * from './market.types';
