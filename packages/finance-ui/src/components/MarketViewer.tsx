'use client';
import { MarketData } from '@mtr/finance-core';
import { useCurrency } from '@mtr/hooks';
import { BaseGrid, BaseTab } from '@mtr/ui/client';
import { _ } from '@mtr/utils';
import { GridApi } from 'ag-grid-community';
import { useTheme } from 'next-themes';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { CurrencyTab } from '../components/CurrencyTab';
import { createMarketColumns } from '../grid';
import { MarketViewerProps } from '../types';

export const MarketViewer = ({
  assetTabs,
  dataTypeTabs,
  data,
  selectedAsset,
  selectedMarketDataType,
  onAssetChange,
  onMarketDataTypeChange,
  onPageChanged,
  onRowClicked,
  showDataTypeTabs = true,
  exchangeRate,
}: MarketViewerProps) => {
  const { theme, resolvedTheme } = useTheme();
  const { currency, setCurrency } = useCurrency(exchangeRate, data?.[0], selectedAsset);
  const gridApiRef = useRef<GridApi<MarketData> | null>(null);
  const dynamicColumns = useMemo(
    () =>
      createMarketColumns(data, {
        currency,
        exchangeRate,
      }),
    [data, currency, selectedAsset, exchangeRate],
  );

  useEffect(() => {
    gridApiRef.current?.refreshCells({ force: true, columns: ['price'] });
  }, [currency, exchangeRate]);

  const getGridTheme = () => {
    const currentTheme = resolvedTheme || theme;
    switch (currentTheme) {
      case 'light':
        return 'MODERN_LIGHT';
      case 'dark':
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

  const debouncedPageChange = useCallback(
    _.debounce((symbols: string[]) => {
      onPageChanged?.(symbols);
    }, 100),
    [onPageChanged],
  );

  return (
    <>
      <div className="flex w-full gap-4 mb-4">
        <div className="flex justify-start">
          <BaseTab data={assetTabs} defaultValue={selectedAsset} onValueChange={onAssetChange} />
        </div>
        <div className="flex w-full justify-end gap-3">
          <div className="justify-start">
            {showDataTypeTabs && (
              <BaseTab
                data={dataTypeTabs}
                defaultValue={selectedMarketDataType}
                onValueChange={onMarketDataTypeChange}
              />
            )}
          </div>
          <div className="justify-end">
            <CurrencyTab currency={currency} onValueChange={value => setCurrency(value)} />
          </div>
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
          alwaysShowVerticalScroll: false,
          suppressHorizontalScroll: false,
          suppressCellFocus: true,
          rowClass: 'cursor-pointer',
          rowSelection: 'single',
          getRowId: (params: any) => params.data.symbol + params.data.assetType,
          cellFlashDuration: 700,
          cellFadeDuration: 400,

          onRowClicked: params => {
            onRowClicked?.(params.data as MarketData);
          },

          onGridReady: (params: any) => {
            gridApiRef.current = params.api;
            params.api.sizeColumnsToFit();
            const symbols = getCurrentPageSymbols(0);
            debouncedPageChange?.(symbols);
          },

          onPaginationChanged: params => {
            const currentPage = params.api.paginationGetCurrentPage();
            const symbols = getCurrentPageSymbols(currentPage);
            debouncedPageChange?.(symbols);
          },
        }}
      />
    </>
  );
};
