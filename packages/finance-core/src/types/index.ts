import { AssetParams, MarketData } from './market.types';

export * from './timeFrame';
export * from './market.types';

export type FinancialService = {
  getAssets: (params: AssetParams) => Promise<MarketData[]>;
};
