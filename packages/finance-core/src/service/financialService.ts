import { HttpClient } from '@mtr/network-core';
import {
  AssetParams,
  FINANCIAL_ROUTES,
  FinancialService,
  MarketData,
  MarketDataType,
} from '@mtr/finance-core';

export const createFinancialService = (httpClient: HttpClient): FinancialService => {
  const getAssets = async ({ assetType, symbol }: AssetParams): Promise<MarketData[]> => {
    const { data } = await httpClient.get<MarketData[]>(FINANCIAL_ROUTES.FINANCIAL.MARKET, {
      assetType,
      dataType: MarketDataType.SYMBOL,
      symbols: [symbol],
    });

    if (!data || data.length === 0) {
      throw new Error(`[API] Asset not found for symbol: ${symbol}`);
    }

    return data;
  };

  return {
    getAssets,
  };
};
