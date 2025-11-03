import { AssetType, Currency, formatPriceByCurrency, MarketData } from '@mtr/finance-core';
import { useMemo, useState } from 'react';

export const useCurrency = (exchangeRate: number, assetData: MarketData, assetType: AssetType) => {
  const [currency, setCurrency] = useState<Currency>(Currency.USD);
  const formattedPrice = useMemo(() => {
    return formatPriceByCurrency({
      price: assetData?.price,
      from: assetData?.currency,
      to: currency,
      exchangeRate: 1300,
      assetType: assetType,
    });
  }, [assetData?.price, currency, exchangeRate, assetType]);

  return { currency, setCurrency, formattedPrice };
};
