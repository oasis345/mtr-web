'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  MARKET_ASSETS,
  MARKET_DATA_TYPES,
  MarketViewer,
  isMarketAsset,
  isMarketDataType,
  marketColumns,
} from '@mtr/finance';
import { MarketAsset, MarketData, MarketDataType } from '@mtr/finance/src/components/types/tabs';

export function MarketPageClient({ initialData }: { initialData: MarketData[] }) {
  // --- URL 상태 관리 로직 ---
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 (e.g., '/')
  const searchParams = useSearchParams(); // 현재 쿼리 파라미터 (읽기 전용)

  // 2. URL에서 현재 선택된 값을 읽어옵니다. (초기값으로 사용)
  const assetParam = searchParams.get('asset');
  const currentAsset = isMarketAsset(assetParam) ? assetParam : MarketAsset.STOCKS;
  const dataTypeParam = searchParams.get('dataType');
  const currentDataType = isMarketDataType(dataTypeParam)
    ? dataTypeParam
    : MarketDataType.MOST_ACTIVE;

  const handleAssetChange = useCallback(
    (asset: string) => {
      // 새 쿼리 파라미터 객체 생성
      const params = new URLSearchParams(searchParams);
      params.set('asset', asset);

      // URL을 교체합니다. (push 대신 replace를 사용하면 브라우저 히스토리가 쌓이지 않습니다)
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const handleMarketDataTypeChange = useCallback(
    (dataType: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('dataType', dataType);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  return (
    <MarketViewer
      data={initialData}
      columns={marketColumns}
      selectedAsset={currentAsset}
      selectedMarketDataType={currentDataType}
      assetTabs={MARKET_ASSETS}
      dataTypeTabs={MARKET_DATA_TYPES}
      onAssetChange={handleAssetChange}
      onMarketDataTypeChange={handleMarketDataTypeChange}
    />
  );
}
