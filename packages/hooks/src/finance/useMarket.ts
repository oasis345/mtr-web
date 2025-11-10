import { AssetQueryParams, TickerData } from '@mtr/finance-core';
import { useQuery } from '@tanstack/react-query';

export interface UseAssetsParams {
  params: AssetQueryParams;
  fetcher: (params: AssetQueryParams) => Promise<TickerData[]>;
}

export const useMarket = ({ params, fetcher }: UseAssetsParams) => {
  const queryKey = [params.assetType, params.dataType, params.symbols.join(',')];
  const response = useQuery<TickerData[]>({
    queryKey: queryKey,
    queryFn: () => fetcher(params),
  });

  return { ...response, queryKey };
};
