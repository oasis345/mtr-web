import {
  AssetQueryParams,
  CandleQueryParams,
  CandleResponse,
  ExchangeRate,
  FINANCIAL_ROUTES,
  FinancialService,
  MarketData,
  StockMarketStatus,
  Trade,
} from '@mtr/finance-core';
import { HttpClient } from '@mtr/network-core';

export const createFinancialService = (httpClient: HttpClient): FinancialService => {
  const getAssets = async (params: AssetQueryParams): Promise<MarketData[]> => {
    const response = await httpClient.get<MarketData[]>(FINANCIAL_ROUTES.FINANCIAL.MARKET, params);
    const { data } = response;
    if (!data) throw new Error(response.message);
    return data;
  };

  const getCandles = async (params: CandleQueryParams): Promise<CandleResponse> => {
    const response = await httpClient.get<CandleResponse>(FINANCIAL_ROUTES.FINANCIAL.CANDLES, params);

    const { data } = response;
    if (!data) throw new Error(response.message);
    return data;
  };

  const getTrades = async (params: AssetQueryParams): Promise<Trade[]> => {
    const response = await httpClient.get<Trade[]>(FINANCIAL_ROUTES.FINANCIAL.TRADES, params);
    const { data } = response;
    if (!data) throw new Error(response.message);
    return data;
  };

  const getExchangeRates = async () => {
    const response = await httpClient.get<ExchangeRate>(FINANCIAL_ROUTES.FINANCIAL.EXCHANGE_RATE);
    const { data } = response;
    if (!data) throw new Error(response.message);
    return data;
  };

  const getStockMarketStatus = async (country: string) => {
    const response = await httpClient.get<keyof typeof StockMarketStatus>(
      FINANCIAL_ROUTES.FINANCIAL.STOCK_MARKET_STATUS,
      { country },
    );
    const { data } = response;
    if (!data) throw new Error(response.message);
    return data;
  };

  return {
    getAssets,
    getCandles,
    getTrades,
    getExchangeRates,
    getStockMarketStatus,
  };
};
