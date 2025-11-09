import { AssetType, Currency, formatPriceByCurrency, MarketData } from '@mtr/finance-core';
import { useMemo, useState } from 'react';

export const useCurrency = (exchangeRate: number, assetData: MarketData, assetType: AssetType) => {
  const [currency, setCurrency] = useState<Currency>(Currency.KRW);
  const formattedPrice = useMemo(() => {
    if (!assetData || !exchangeRate) return '-';
    const value = formatPriceByCurrency({
      price: assetData?.price,
      from: assetData?.currency,
      to: currency,
      exchangeRate,
      assetType: assetType,
    });

    return value;
  }, [assetData?.price, currency, exchangeRate, assetType]);

  return { currency, setCurrency, formattedPrice };
};
