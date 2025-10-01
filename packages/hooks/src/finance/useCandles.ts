import { useQuery } from '@tanstack/react-query';
import {
  CandleQueryParams,
  transformToChartData,
  ChartData,
  CandleResponse,
} from '@mtr/finance-core';

export interface UseCandlesParams {
  params: CandleQueryParams;
  fetcher: (params: CandleQueryParams) => Promise<CandleResponse>;
}

export const useCandles = ({ params, fetcher }: UseCandlesParams) => {
  return useQuery<CandleResponse, Error, ChartData>({
    queryKey: [params.assetType, params.dataType, params.timeframe, params.symbols],
    queryFn: () => fetcher(params),
    select: data => transformToChartData(data.candles || [], params.timeframe), // timeframe 전달
    enabled: !!params.timeframe,
  });
};
