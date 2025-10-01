import { useQuery } from '@tanstack/react-query';
import { AssetQueryParams, MarketData, AssetType, MarketDataType } from '@mtr/finance-core';

export interface UseAssetsParams {
  params: AssetQueryParams;
  fetcher: (params: AssetQueryParams) => Promise<MarketData[]>;
}

export const useAssets = ({ params, fetcher }: UseAssetsParams) => {
  return useQuery<MarketData[], Error, MarketData>({
    queryKey: [params.assetType, params.dataType, params.symbols],
    queryFn: () => fetcher(params),
    select: data => data?.[0],
  });
};
