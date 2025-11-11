// 클라이언트 측 useInfiniteCandles.ts
import {
  CandleQueryParams,
  CandleResponse,
  getLimitByTimeframe,
  getTTLbyTimeframe,
  MarketDataType,
} from '@mtr/finance-core';
import { InfiniteData, useInfiniteQuery } from '@tanstack/react-query'; // UseInfiniteQueryResult 임포트 추가

interface UseInfiniteCandlesOptions {
  params: CandleQueryParams;
  fetcher: (params: CandleQueryParams) => Promise<CandleResponse>;
}

// 훅의 반환 타입에 queryKey를 추가합니다.
export const useInfiniteCandles = ({ params, fetcher }: UseInfiniteCandlesOptions) => {
  const limit = params.limit ?? getLimitByTimeframe(params.assetType, params.timeframe);
  const cacheConfig = getTTLbyTimeframe(params.timeframe);
  const queryKey: string[] = [params.assetType, params.dataType, params.timeframe, params.symbols.join(',')]; // 훅 내부에서 queryKey를 생성
  const response = useInfiniteQuery<CandleResponse, Error, InfiniteData<CandleResponse>, string[], string>({
    queryKey: queryKey,

    initialPageParam: undefined,

    queryFn: ({ pageParam }) => {
      return fetcher({
        ...params,
        dataType: MarketDataType.CANDLES,
        limit,
        start: pageParam,
      });
    },

    getNextPageParam: lastPage => {
      return lastPage.nextDateTime ?? undefined;
    },
    staleTime: cacheConfig.staleTime,
    gcTime: cacheConfig.gcTime,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!params.timeframe,
  });

  return { ...response, queryKey };
};
