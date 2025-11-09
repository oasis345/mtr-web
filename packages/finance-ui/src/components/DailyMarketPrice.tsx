import { Candle, Currency } from '@mtr/finance-core';
import { BaseGrid } from '@mtr/ui/client';
import { _ } from '@mtr/utils';
import { GridApi } from 'ag-grid-community';
import { useEffect, useMemo, useRef } from 'react';
import { createDailyColumns } from '../grid/dailyColumns';
import { InfiniteController } from '../types';

type DailyMarketPriceProps = {
  currency: Currency;
  exchangeRate: number;
  controller: InfiniteController<Candle[]>;
};

// 탭 관련 로직이 제거된 순수한 데이터 그리드 컴포넌트
export const DailyMarketPrice = ({ currency, exchangeRate, controller }: DailyMarketPriceProps) => {
  const { items, loadNext, hasNext, isLoadingNext } = controller;
  const gridApiRef = useRef<GridApi | null>(null);
  const dynamicColumns = useMemo(() => {
    return createDailyColumns({ currency, exchangeRate });
  }, [currency]);

  const debouncedFetch = useMemo(
    () =>
      _.debounce(() => {
        const api = gridApiRef.current;
        if (!api || isLoadingNext || !hasNext) {
          return;
        }

        const lastDisplayedRow = api.getLastDisplayedRowIndex();
        const totalRows = api.getDisplayedRowCount();
        if (totalRows > 0 && lastDisplayedRow >= totalRows - 10) {
          void loadNext();
        }
      }, 300),
    [hasNext, isLoadingNext, loadNext],
  );

  const onBodyScroll = () => {
    debouncedFetch();
  };

  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  return (
    <BaseGrid
      data={items}
      columns={dynamicColumns}
      options={{
        getRowId: (params: any) => {
          return params.data.timestamp + params.data.symbol;
        },
        paginationPageSizeSelector: false,
        alwaysShowVerticalScroll: false,
        suppressHorizontalScroll: false,
        onGridReady: (params: any) => {
          gridApiRef.current = params.api;
          // params.api.sizeColumnsToFit();
        },
        onBodyScroll: onBodyScroll,
      }}
    />
  );
};
