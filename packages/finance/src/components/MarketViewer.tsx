'use client';
import { BaseGrid, BaseTab } from '@mtr/ui/client';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useState } from 'react';
import type {
  MarketAsset,
  MarketData,
  MarketDataType,
  MarketDataTypeTab,
  MarketTab,
} from './types/tabs';
import { ColDef } from 'ag-grid-community';
import { createMarketColumns } from './model/maketColumns';
import { _ } from '@mtr/utils';

export interface MarketViewerProps {
  data: MarketData[];
  columns?: ColDef<MarketData>[];
  assetTabs: MarketTab[];
  dataTypeTabs: MarketDataTypeTab[];
  selectedAsset?: MarketAsset;
  selectedMarketDataType?: MarketDataType;
  onAssetChange?: (category: MarketAsset) => void;
  onMarketDataTypeChange?: (marketDataType: MarketDataType) => void;
  onPageChanged?: (symbols: string[]) => void; // ✅ 새로운 prop
}

export const MarketViewer = ({
  assetTabs,
  dataTypeTabs,
  data,
  columns,
  selectedAsset,
  selectedMarketDataType,
  onAssetChange,
  onMarketDataTypeChange,
  onPageChanged, // ✅ 새로운 prop
}: MarketViewerProps) => {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dynamicColumns = columns || createMarketColumns(data);

  const getGridTheme = () => {
    if (!mounted) {
      return 'PROFESSIONAL_DARK';
    }
    const currentTheme = resolvedTheme || theme;
    switch (currentTheme) {
      case 'dark':
        return 'PROFESSIONAL_DARK';
      case 'light':
        return 'MODERN_LIGHT';
      default:
        return 'PROFESSIONAL_DARK';
    }
  };

  const getCurrentPageSymbols = useCallback(
    (currentPage: number, pageSize: number = 10) => {
      const startIndex = currentPage * pageSize;
      const endIndex = startIndex + pageSize;
      const currentPageData = data.slice(startIndex, endIndex);
      return currentPageData.map(item => item.symbol).filter(Boolean);
    },
    [data],
  );

  // ✅ 디바운스된 페이지 변경 핸들러
  const debouncedPageChange = useCallback(
    _.debounce((symbols: string[]) => {
      onPageChanged?.(symbols);
    }, 100),
    [onPageChanged],
  );

  return (
    <>
      <div className="flex gap-4 mb-4">
        <div className="flex-1 justify-start">
          <BaseTab data={assetTabs} defaultValue={selectedAsset} onValueChange={onAssetChange} />
        </div>
        <div className="flex justify-end">
          <BaseTab
            data={dataTypeTabs}
            defaultValue={selectedMarketDataType}
            onValueChange={onMarketDataTypeChange}
          />
        </div>
      </div>

      <BaseGrid
        data={data}
        columns={dynamicColumns}
        theme={getGridTheme()}
        height={490}
        options={{
          pagination: true,
          paginationPageSize: 10,
          paginationPageSizeSelector: false,
          alwaysShowVerticalScroll: false, // 세로 스크롤바 숨기기
          suppressHorizontalScroll: false, // 가로 스크롤 허용
          cellFlashDuration: 600,
          cellFadeDuration: 300,

          onGridReady: params => {
            params.api.sizeColumnsToFit();
            // ✅ 첫 페이지 symbol들
            const symbols = getCurrentPageSymbols(0);
            debouncedPageChange?.(symbols);
          },

          onPaginationChanged: params => {
            // ✅ 현재 페이지 symbol들
            const currentPage = params.api.paginationGetCurrentPage();
            const symbols = getCurrentPageSymbols(currentPage);
            debouncedPageChange?.(symbols);
          },
        }}
      />
    </>
  );
};
