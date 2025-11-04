import { AssetQueryParams, Trade } from '@mtr/finance-core';
import { useQuery } from '@tanstack/react-query';

export interface UseTradesParams {
  params: AssetQueryParams;
  fetcher: (params: AssetQueryParams) => Promise<Trade[]>;
}

export const useTrades = ({ params, fetcher }: UseTradesParams) => {
  const queryKey = [params.assetType, params.dataType, params.symbols.join(',')];
  const response = useQuery<Trade[]>({
    queryKey: queryKey,
    queryFn: () => fetcher(params),
    gcTime: 1_000,
  });

  return { ...response, queryKey };
};
