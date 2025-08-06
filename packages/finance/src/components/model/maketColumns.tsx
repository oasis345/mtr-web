// packages/finance/src/components/model/maketColumns.tsx
import { ColDef } from 'ag-grid-community';

export const marketColumns: ColDef[] = [
  {
    field: 'id',
    headerName: 'ID',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'name',
    headerName: '종목',
    flex: 3,
    minWidth: 200,
    maxWidth: 500,
    sortable: true,
    valueGetter: params => {
      const { symbol, name } = params.data;
      return `${name} ${symbol ? `(${symbol})` : ''}`;
    },
  },
  {
    field: 'price',
    headerName: '현재가',
    flex: 1,
    minWidth: 100,
    sortable: true,
    valueFormatter: params => {
      return `${new Intl.NumberFormat('ko-KR').format(params.value)}원`;
    },
  },
  {
    field: 'changePercent',
    headerName: '등락률',
    flex: 1,
    sortable: true,
    valueFormatter: params => {
      const value = params.value;
      const sign = value >= 0 ? '+' : '';
      return `${sign}${value}%`;
    },
    cellStyle: params => {
      const value = params.value;
      return {
        color: value >= 0 ? '#ef4444' : '#3b82f6',
        fontWeight: '500',
      };
    },
  },
  {
    field: 'volume',
    headerName: '거래량 많은 순',
    flex: 1,
    sortable: true,
    valueFormatter: params => {
      return `${new Intl.NumberFormat('ko-KR').format(params.value)}주`;
    },
  },
];
