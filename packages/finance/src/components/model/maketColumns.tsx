'use client';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';
import { MarketData } from '../types/tabs';
import { _ } from '@mtr/utils';

// --- 재사용 가능한 포맷터 ---
const usdCurrencyFormatter = new Intl.NumberFormat('en-US', {
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

// --- 기본 컬럼들 (항상 포함) ---
const baseColumns: ColDef<MarketData>[] = [
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
    enableCellChangeFlash: true,
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
    enableCellChangeFlash: true,
    valueFormatter: (params: ValueFormatterParams<MarketData, number>) => {
      if (_.isNull(params.value)) return '-';
      const valueAsDecimal = params.value / 100;
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
];

// --- 거래량 컬럼 (조건부 포함) ---
const volumeColumn: ColDef<MarketData> = {
  field: 'volume',
  headerName: '거래량',
  flex: 1,
  sortable: true,
  valueFormatter: (params: ValueFormatterParams<MarketData, number>) => {
    const value = params.value;
    if (_.isNull(value)) return '-';
    return volumeFormatter.format(value);
  },
};

// --- 데이터에 거래량이 있는지 확인하는 함수 ---
const hasVolumeData = (data: MarketData[]): boolean => {
  if (!data || data.length === 0) return false;

  // 데이터 중 하나라도 유효한 volume 값이 있으면 true
  return data.some(
    item =>
      item.volume !== null && item.volume !== undefined && !isNaN(item.volume) && item.volume > 0,
  );
};

// --- 동적 컬럼 생성 함수 ---
export const createMarketColumns = (data: MarketData[]): ColDef<MarketData>[] => {
  const columns = [...baseColumns];

  // 거래량 데이터가 있으면 거래량 컬럼 추가
  if (hasVolumeData(data)) {
    columns.push(volumeColumn);
  }

  return columns;
};

// --- 기존 호환성을 위한 기본 컬럼 (거래량 포함) ---
export const marketColumns: ColDef<MarketData>[] = [...baseColumns, volumeColumn];
