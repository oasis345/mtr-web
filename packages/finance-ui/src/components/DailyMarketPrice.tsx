import { Candle, Currency } from '@mtr/finance-core';
import { BaseGrid, BaseTab } from '@mtr/ui/client';
import { createDailyColumns } from '../grid/dailyColumns';
import { useMemo, useRef, useEffect } from 'react';
import { GetRowIdParams, GridApi } from 'ag-grid-community';
import { InfiniteController } from '../types';
import { _ } from '@mtr/utils';

type DailyMarketPriceProps = {
  currency: Currency;
  controller: InfiniteController<Candle>;
};

export const DailyMarketPrice = ({ currency, controller }: DailyMarketPriceProps) => {
  const { items, loadNext, hasNext, isLoadingNext } = controller;
  const gridApiRef = useRef<GridApi | null>(null);
  const dynamicColumns = useMemo(() => {
    return createDailyColumns({ currency, exchangeRate: 1300 });
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
      }, 300), // 300ms 디바운스
    [hasNext, isLoadingNext, loadNext],
  );

  const onBodyScroll = () => {
    debouncedFetch();
  };

  // 컴포넌트 언마운트 시 디바운스 타이머 정리 (메모리 누수 방지)
  useEffect(() => {
    return () => {
      debouncedFetch.cancel();
    };
  }, [debouncedFetch]);

  const tabData = [
    { label: '실시간', value: 'realTime' },
    { label: '일별', value: 'day' },
  ];

  return (
    <div className="flex flex-col w-full">
      <BaseTab data={tabData} defaultValue="day" onValueChange={() => {}} variant="underline" />
      <BaseGrid
        data={items}
        columns={dynamicColumns}
        options={{
          getRowId: (params: GetRowIdParams<Candle>) => params.data.timestamp + params.data.symbol,
          onGridReady: params => {
            gridApiRef.current = params.api;
          },
          onBodyScroll: onBodyScroll,
        }}
      />
    </div>
  );
};
