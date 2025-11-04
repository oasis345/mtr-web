import { Currency, formatPriceByCurrency, percentFormatter, Trade } from '@mtr/finance-core';
import { _, dayjs } from '@mtr/utils';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';

type ColumnOpts = { currency: Currency; exchangeRate?: number };
const getBaseColumns = (opts: ColumnOpts): ColDef<Trade>[] => {
  const { currency, exchangeRate = 1300 } = opts;

  return [
    {
      field: 'price',
      headerName: '체결가',
      valueFormatter: (params: ValueFormatterParams<Trade, number>) => {
        const { data, value } = params;
        if (value == null || !data) return '-';

        return formatPriceByCurrency({
          price: value,
          from: data.currency,
          to: currency,
          exchangeRate,
          assetType: data.assetType,
        });
      },
    },
    {
      field: 'volume',
      headerName: '체결량',
      valueFormatter: (params: ValueFormatterParams<Trade, string>) => {
        return params.value;
      },
    },
    {
      field: 'changePercentage',
      headerName: '등락률',
      valueFormatter: p => percentFormatter(p.value),
      cellStyle: p => {
        const v = p.value as number | null | undefined;
        if (_.isNull(v)) return null;
        return { color: v >= 0 ? '#ef4444' : '#3b82f6', fontWeight: '500' };
      },
    },
    {
      field: 'timestamp',
      headerName: '시간',
      valueFormatter: (params: ValueFormatterParams<Trade, string>) => {
        return dayjs(params.value).format('HH:mm:ss');
      },
    },
  ];
};

export const createTradeColumns = (opts: ColumnOpts): ColDef<Trade>[] => [...getBaseColumns(opts)];
