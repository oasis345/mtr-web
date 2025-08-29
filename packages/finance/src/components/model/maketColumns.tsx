'use client';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { MarketData } from '../types/tabs';
import { _ } from '@mtr/utils';

// --- 재사용 가능한 포맷터 (변경 없음) ---
const usdCurrencyFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 1,
  maximumFractionDigits: 4,
});

const percentFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'percent',
  signDisplay: 'exceptZero',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const volumeFormatter = new Intl.NumberFormat('ko-KR', {
  style: 'decimal',
  notation: 'compact',
  maximumFractionDigits: 2,
});

export const marketColumns: ColDef<MarketData>[] = [
  {
    field: 'symbol',
    headerName: '티커',
    flex: 1,
    minWidth: 100,
    maxWidth: 100,
  },
  {
    field: 'name',
    headerName: '종목명',
    flex: 3,
    minWidth: 200,
    maxWidth: 500,
    sortable: true,
  },
  {
    field: 'price',
    headerName: '현재가',
    flex: 1,
    minWidth: 100,
    sortable: true,
    valueFormatter: (params: ValueFormatterParams<MarketData, number>) => {
      const value = params.value;
      if (_.isNull(value)) return '-';
      return usdCurrencyFormatter.format(value);
    },
  },
  {
    field: 'change',
    headerName: '전일대비',
    flex: 1,
    sortable: true,
    valueFormatter: (params: ValueFormatterParams<MarketData, number>) => {
      const value = params.value;
      if (_.isNull(value)) return '-';
      return usdCurrencyFormatter.format(value);
    },
  },
  {
    field: 'changesPercentage',
    headerName: '등락률',
    flex: 1,
    sortable: true,
    valueFormatter: (params: ValueFormatterParams<MarketData, number>) => {
      const value = params.value;
      if (_.isNull(value)) return '-';
      const valueAsDecimal = value / 100;
      return percentFormatter.format(valueAsDecimal);
    },
    cellStyle: params => {
      const value = params.value;
      if (_.isNull(value)) return null;
      return {
        color: value >= 0 ? '#ef4444' : '#3b82f6',
        fontWeight: '500',
      };
    },
  },
  {
    field: 'volume',
    headerName: '거래량',
    flex: 1,
    sortable: true,
    valueFormatter: (params: ValueFormatterParams<MarketData, number>) => {
      const value = params.value;
      if (_.isNull(value)) return '-';
      return volumeFormatter.format(value);
    },
  },
];
