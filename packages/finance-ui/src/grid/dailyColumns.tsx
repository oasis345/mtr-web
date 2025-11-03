import { Candle, Currency, formatPriceByCurrency, percentFormatter, volumeFormatter } from '@mtr/finance-core';
import { _, dayjs } from '@mtr/utils';
import { ColDef, ValueFormatterParams } from 'ag-grid-community';

type ColumnOpts = { currency: Currency; exchangeRate?: number };
const getBaseColumns = (opts: ColumnOpts): ColDef<Candle>[] => {
  const { currency, exchangeRate = 1300 } = opts;

  return [
    {
      field: 'timestamp',
      width: 120,
      headerName: '일자',
      valueFormatter: (params: ValueFormatterParams<Candle, string>) => {
        return dayjs(params.value).format('YYYY/MM/DD');
      },
    },
    {
      field: 'close',
      width: 120,
      headerName: '종가',
      valueFormatter: (params: ValueFormatterParams<Candle, number>) => {
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
      field: 'volume',
      headerName: '거래량(주)',
      valueFormatter: (params: ValueFormatterParams<Candle, number>) => {
        return volumeFormatter.format(params.value);
      },
    },
    // {
    //   field: 'tradeCount',
    //   headerName: '거래횟수',
    //   valueFormatter: (params: ValueFormatterParams<Candle, number>) => {
    //     const { data, value } = params;
    //     if (value == null || !data) return '-';

    //     return volumeFormatter.format(params.value);
    //   },
    // },
    {
      field: 'open',
      headerName: '시가',
      valueFormatter: (params: ValueFormatterParams<Candle, number>) => {
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
      field: 'high',
      headerName: '고가',
      valueFormatter: (params: ValueFormatterParams<Candle, number>) => {
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
      field: 'low',
      headerName: '저가',
      valueFormatter: (params: ValueFormatterParams<Candle, number>) => {
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
  ];
};

export const createDailyColumns = (opts: ColumnOpts): ColDef<Candle>[] => [...getBaseColumns(opts)];
