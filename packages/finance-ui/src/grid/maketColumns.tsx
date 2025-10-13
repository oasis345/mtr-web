'use client';
import { ColDef, ValueFormatterParams, ICellRendererParams } from 'ag-grid-community';
import { MarketData, Currency } from '@mtr/finance-core';
import { _ } from '@mtr/utils';
import { percentFormatter, volumeFormatter, formatPrice, convertCurrency } from '@mtr/finance-core';
import { SymbolCell } from './SymbolCell';

// --- 거래량 컬럼 (조건부 포함) ---
const volumeColumn: ColDef<MarketData> = {
  field: 'volume',
  headerName: '거래량(24h)',
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

// --- 기본 컬럼들 생성 (통화/환율 옵션 적용) ---
type ColumnOpts = { currency: Currency; exchangeRate?: number };

const getBaseColumns = (opts: ColumnOpts): ColDef<MarketData>[] => {
  const { currency, exchangeRate = 1300 } = opts;

  return [
    {
      field: 'symbol',
      headerName: '티커',
      flex: 1,
      minWidth: 400,
      maxWidth: 400,
      resizable: true,
      cellRenderer: (params: ICellRendererParams<MarketData>) => {
        return <SymbolCell data={params.data} />;
      },
    },
    // { field: 'name', headerName: '종목명', flex: 3, minWidth: 200, maxWidth: 500, sortable: true },
    {
      field: 'price',
      headerName: '현재가',
      enableCellChangeFlash: true,
      // ...
      valueFormatter: (params: ValueFormatterParams<MarketData, number>) => {
        const { data, value } = params;
        if (value == null || !data) return '-';

        const convertedPrice = convertCurrency(value, {
          from: data.currency,
          to: currency,
          exchangeRate: exchangeRate,
        });

        // [변경점] formatPrice 호출 시 assetType을 함께 전달
        return formatPrice(convertedPrice, {
          currency: currency,
          assetType: data.assetType, // data 객체에 assetType이 있다고 가정
        });
      },
    },
    {
      field: 'changePercentage',
      headerName: '등락률',
      flex: 1,
      sortable: true,
      valueFormatter: p => percentFormatter(p.value),
      cellStyle: p => {
        const v = p.value as number | null | undefined;
        if (_.isNull(v)) return null;
        return { color: v >= 0 ? '#ef4444' : '#3b82f6', fontWeight: '500' };
      },
    },
  ];
};

// --- 동적 컬럼 생성 함수 ---
export const createMarketColumns = (data: MarketData[], opts: ColumnOpts): ColDef<MarketData>[] => {
  const columns = [...getBaseColumns(opts)];
  if (hasVolumeData(data)) columns.push(volumeColumn);
  return columns;
};
