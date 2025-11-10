import { AssetQueryParams, CandleResponse, ExchangeRate, StockMarketStatus, TickerData, Trade } from './market.types';

export interface FinancialService {
  getAssets: (params: AssetQueryParams) => Promise<TickerData[]>;
  getCandles: (params: AssetQueryParams) => Promise<CandleResponse>;
  getTrades: (params: AssetQueryParams) => Promise<Trade[]>;
  getExchangeRates: () => Promise<ExchangeRate>;
  getStockMarketStatus: (country: string) => Promise<keyof typeof StockMarketStatus>;
}

export * from './timeFrame';
export * from './market.types';
