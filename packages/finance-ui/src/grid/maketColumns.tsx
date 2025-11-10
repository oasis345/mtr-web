'use client';
import {
  convertCurrency,
  Currency,
  formatPrice,
  MarketDataType,
  percentFormatter,
  TickerData,
  volumeFormatter,
} from '@mtr/finance-core';
import { _ } from '@mtr/utils';
import { ColDef, ICellRendererParams, ValueFormatterParams } from 'ag-grid-community';
import { SymbolCell } from './SymbolCell';

// --- 거래량 컬럼 (조건부 포함) ---
const accVolumeColumn: ColDef<TickerData> = {
  field: 'accTradeVolume',
  headerName: '거래량',
  flex: 1,
  sortable: true,
  valueFormatter: (params: ValueFormatterParams<TickerData, number>) => {
    const value = params.value;
    if (_.isNull(value)) return '-';
    return volumeFormatter.format(value);
  },
};

const accPriceColumn: ColDef<TickerData> = {
  field: 'accTradePrice',
  headerName: '거래대금',
  flex: 1,
  valueFormatter: (params: ValueFormatterParams<TickerData, number>) => {
    const value = params.value;
    if (_.isNull(value)) return '-';
    return volumeFormatter.format(value);
  },
};

// --- 기본 컬럼들 생성 (통화/환율 옵션 적용) ---
type ColumnOpts = { currency: Currency; exchangeRate?: number };

const getBaseColumns = (opts: ColumnOpts): ColDef<TickerData>[] => {
  const { currency, exchangeRate = 1300 } = opts;

  return [
    {
      field: 'symbol',
      headerName: '티커',
      flex: 1,
      minWidth: 400,
      maxWidth: 400,
      resizable: true,
      cellRenderer: (params: ICellRendererParams<TickerData>) => {
        return <SymbolCell data={params.data} />;
      },
    },
    // { field: 'name', headerName: '종목명', flex: 3, minWidth: 200, maxWidth: 500, sortable: true },
    {
      field: 'price',
      headerName: '현재가',
      enableCellChangeFlash: true,
      // ...
      valueFormatter: (params: ValueFormatterParams<TickerData, number>) => {
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
export const createMarketColumns = (
  data: TickerData[],
  opts: ColumnOpts,
  dataType: MarketDataType,
): ColDef<TickerData>[] => {
  const columns = [...getBaseColumns(opts)];
  if (dataType === MarketDataType.MOST_ACTIVE || dataType === MarketDataType.TOP_TRADED) {
    columns.push(accVolumeColumn);
    columns.push(accPriceColumn);
  }

  return columns;
};
