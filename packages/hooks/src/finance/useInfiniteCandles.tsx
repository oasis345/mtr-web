// 클라이언트 측 useInfiniteCandles.ts
import { useInfiniteQuery } from '@tanstack/react-query';
import {
  MarketDataType,
  CandleQueryParams,
  CandleResponse,
  getLimitByTimeframe,
} from '@mtr/finance-core';

type Fetcher = (p: any) => Promise<CandleResponse>;

export const useInfiniteCandles = (params: CandleQueryParams, fetcher: Fetcher) => {
  const limit = params.limit ?? getLimitByTimeframe(params.timeframe);

  return useInfiniteQuery({
    queryKey: [params.assetType, params.dataType, params.timeframe, params.symbols],

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

    refetchOnMount: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    enabled: !!params.timeframe,
  });
};
