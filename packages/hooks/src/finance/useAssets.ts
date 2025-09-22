import { useQuery } from '@tanstack/react-query';
import { AssetParams, MarketData } from '@mtr/finance-core';
import { useCallback } from 'react';

export type UseAssetParams = AssetParams & {
  fetchAssets: (params: AssetParams) => Promise<MarketData[]>;
};

export const useAssets = (params: UseAssetParams) => {
  const { assetType, symbol, fetchAssets } = params;

  return useQuery<MarketData[], Error, MarketData>({
    queryKey: ['asset', assetType, symbol],
    queryFn: () => fetchAssets({ assetType, symbol }),
    select: data => data?.[0] || undefined,
    retry: false,
  });
};
