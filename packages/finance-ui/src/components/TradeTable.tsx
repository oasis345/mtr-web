import { Currency, Trade } from '@mtr/finance-core';
import { BaseGrid } from '@mtr/ui/client';
import { GridApi } from 'ag-grid-community';
import { useMemo, useRef } from 'react';
import { createTradeColumns } from '../grid/tradeColumns';

export const TradeTable = ({ currency, data }: { currency: Currency; data: Trade[] }) => {
  const gridApiRef = useRef<GridApi | null>(null);
  const dynamicColumns = useMemo(() => {
    return createTradeColumns({ currency, exchangeRate: 1300 });
  }, [currency]);

  return (
    <div>
      <BaseGrid
        data={data}
        columns={dynamicColumns}
        options={{
          getRowId: (params: any) => {
            const { id, timestamp, volume } = params.data;
            const rowId = volume.toFixed(10) + id + String(timestamp);
            return rowId;
          },
          paginationPageSizeSelector: false,
          alwaysShowVerticalScroll: false,
          suppressHorizontalScroll: false,
          onGridReady: (params: any) => {
            gridApiRef.current = params.api;
            params.api.sizeColumnsToFit();
          },
        }}
      />
    </div>
  );
};
