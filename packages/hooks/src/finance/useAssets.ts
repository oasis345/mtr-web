import { AssetQueryParams, MarketData } from '@mtr/finance-core';
import { useQuery } from '@tanstack/react-query';

export interface UseAssetsParams {
  params: AssetQueryParams;
  fetcher: (params: AssetQueryParams) => Promise<MarketData[]>;
}

export const useAssets = ({ params, fetcher }: UseAssetsParams) => {
  const queryKey = [params.assetType, params.dataType, params.symbols];
  const response = useQuery<MarketData[], Error, MarketData>({
    queryKey: queryKey,
    queryFn: () => fetcher(params),
  });

  return { ...response, queryKey };
};
