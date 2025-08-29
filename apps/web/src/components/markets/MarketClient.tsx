'use client';

import { useState, useCallback } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { MARKET_ASSETS, MARKET_DATA_TYPES, MarketViewer, marketColumns } from '@mtr/finance';
import { MarketData } from '@mtr/finance/src/components/types/tabs';

export function MarketPageClient({ initialData }: { initialData: MarketData[] }) {
  // --- URL 상태 관리 로직 ---
  const router = useRouter();
  const pathname = usePathname(); // 현재 경로 (e.g., '/')
  const searchParams = useSearchParams(); // 현재 쿼리 파라미터 (읽기 전용)

  // 2. URL에서 현재 선택된 값을 읽어옵니다. (초기값으로 사용)
  const currentAsset = searchParams.get('asset') || 'stock';
  const currentDataType = searchParams.get('dataType') || 'marketCap';

  // 3. 쿼리 파라미터를 변경하는 핸들러 함수를 생성합니다.
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
    <div>
      {/* ... 통화 변경 버튼 ... */}

      {/* 4. MarketViewer에는 현재 URL 상태와, URL을 변경할 핸들러를 주입합니다. */}
      <MarketViewer
        data={initialData} // 내부 상태 'data' 대신 prop 'initialData'를 직접 전달
        columns={marketColumns}
        // 선택된 값을 URL에서 직접 읽어 전달
        selectedAsset={currentAsset}
        selectedMarketDataType={currentDataType}
        // 탭이 클릭되면 URL을 변경하는 함수를 전달
        assetTabs={MARKET_ASSETS}
        dataTypeTabs={MARKET_DATA_TYPES}
        onAssetChange={handleAssetChange}
        onMarketDataTypeChange={handleMarketDataTypeChange}
      />
    </div>
  );
}
