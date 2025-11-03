import { Currency, Trade } from '@mtr/finance-core';
import { BaseGrid } from '@mtr/ui/client';
import { GetRowIdParams, GridApi } from 'ag-grid-community';
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
          getRowId: (params: GetRowIdParams<Trade>) => params.data.id + params.data.timestamp,
          paginationPageSizeSelector: false,
          alwaysShowVerticalScroll: false,
          suppressHorizontalScroll: false,
          onGridReady: params => {
            gridApiRef.current = params.api;
            params.api.sizeColumnsToFit();
          },
        }}
      />
    </div>
  );
};
