import { HttpClient } from '@mtr/network-core';
import {
  AssetQueryParams,
  CandleQueryParams,
  CandleResponse,
  FINANCIAL_ROUTES,
  FinancialService,
  MarketData,
  MarketDataType,
} from '@mtr/finance-core';

export const createFinancialService = (httpClient: HttpClient): FinancialService => {
  const getAssets = async ({ assetType, symbols }: AssetQueryParams): Promise<MarketData[]> => {
    const response = await httpClient.get<MarketData[]>(FINANCIAL_ROUTES.FINANCIAL.MARKET, {
      assetType,
      dataType: MarketDataType.SYMBOL,
      symbols,
    });
    const { data } = response;
    if (!data) throw new Error(response.message);
    return data;
  };

  const getCandles = async (params: CandleQueryParams): Promise<CandleResponse> => {
    const response = await httpClient.get<CandleResponse>(
      FINANCIAL_ROUTES.FINANCIAL.CANDLES,
      params,
    );

    const { data } = response;
    if (!data) throw new Error(response.message);
    return data;
  };

  return {
    getAssets,
    getCandles,
  };
};
