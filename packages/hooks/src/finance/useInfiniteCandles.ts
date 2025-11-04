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

    // 1. 첫 페이지 파라미터는 undefined로 설정
    initialPageParam: undefined,

    // 2. queryFn: pageParam (nextDateTime)을 그대로 서버의 start 파라미터로 전달
    queryFn: ({ pageParam }) => {
      return fetcher({
        ...params,
        dataType: MarketDataType.CANDLES,
        limit,
        // pageParam은 두 번째 페이지부터 서버가 준 nextDateTime 값을 가짐
        // 첫 페이지에는 undefined가 전달되어 서버가 기본 기간으로 조회
        start: pageParam,
      });
    },

    // 3. getNextPageParam: 서버가 준 nextDateTime을 그대로 반환
    getNextPageParam: lastPage => {
      // lastPage는 { candles, nextDateTime } 객체
      // nextDateTime이 null이면 undefined를 반환하여 '마지막 페이지'임을 알림
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
