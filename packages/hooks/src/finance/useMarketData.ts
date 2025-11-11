import { AssetQueryParams, TickerData } from '@mtr/finance-core';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo } from 'react';

// 1. 파라미터 타입에 pollingInterval 추가
export interface UseMarketDataParams {
  params: AssetQueryParams;
  fetcher: (params: AssetQueryParams) => Promise<TickerData[]>;
  staleTime?: number;
  pollingInterval?: number; // 선택적 옵션으로 추가 (단위: ms)
}

export const useMarketData = ({ params, fetcher, staleTime, pollingInterval }: UseMarketDataParams) => {
  const queryClient = useQueryClient();
  const symbolsKey = params.symbols?.join(',');
  const queryKey = useMemo(() => {
    const key = ['marketData', params.assetType, params.dataType];
    if (symbolsKey) key.push(symbolsKey);

    return key;
  }, [params.assetType, params.dataType, symbolsKey]);

  const queryResult = useQuery<TickerData[]>({
    queryKey,
    queryFn: () => fetcher(params),
    staleTime,
  });

  useEffect(() => {
    if (!pollingInterval || pollingInterval <= 0) {
      return;
    }

    const intervalId = setInterval(() => {
      console.log(`[Polling] Invalidating query:`, queryKey);
      void queryClient.invalidateQueries({ queryKey });
    }, pollingInterval);

    return () => clearInterval(intervalId);
  }, [queryKey, queryClient, pollingInterval]);

  return { ...queryResult, queryKey };
};
