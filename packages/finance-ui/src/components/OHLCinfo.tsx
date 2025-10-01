'use client';

import { useMemo } from 'react';
import { formatPrice, percentFormatter, volumeFormatter } from '@mtr/finance-core';
import { AssetType, Currency } from '@mtr/finance-core';

type Candle = { time: number | string; open: number; high: number; low: number; close: number };
type Volume = { time: number | string; value: number; color?: string };

type OHLCInfoProps = {
  candle?: Candle;
  volume?: Volume;
  currency?: Currency;
  assetType?: AssetType;
  className?: string;
};

export const OHLCInfo = ({
  candle,
  volume,
  currency = 'USD',
  assetType = AssetType.STOCKS,
  className,
}: OHLCInfoProps) => {
  const priceFormatter = (price: number) => {
    return formatPrice(price, { currency, assetType });
  };

  // 시가 대비 각 가격의 변화율 계산
  const priceChanges = useMemo(() => {
    if (!candle) return null;

    const openPrice = candle.open;
    return {
      high: (candle.high - openPrice) / openPrice,
      low: (candle.low - openPrice) / openPrice,
      close: (candle.close - openPrice) / openPrice,
    };
  }, [candle]);

  const getChangeColor = (changeValue: number) => {
    if (changeValue > 0) return 'text-red-500'; // 양수 = 빨강
    if (changeValue < 0) return 'text-blue-500'; // 음수 = 파랑
  };

  const formatPriceWithChange = (price: number, change: number) => {
    const formattedPrice = priceFormatter(price);
    const formattedChange = percentFormatter(change);
    const changeColor = getChangeColor(change);

    return (
      <>
        {formattedPrice} <span className={`text-xs ${changeColor}`}>{formattedChange})</span>
      </>
    );
  };

  if (!candle || !priceChanges) {
    return (
      <div className={`flex items-center gap-6 text-sm ${className}`}>
        <span>O: --</span>
        <span>H: --</span>
        <span>L: --</span>
        <span>C: --</span>
        <span>V: --</span>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-6 text-sm ${className}`}>
      <span>
        O: <span className="font-mono">{priceFormatter(candle.open)}</span>
      </span>
      <span>
        H:{' '}
        <span className="font-mono">{formatPriceWithChange(candle.high, priceChanges.high)}</span>
      </span>
      <span>
        L: <span className="font-mono">{formatPriceWithChange(candle.low, priceChanges.low)}</span>
      </span>
      <span>
        C:{' '}
        <span className="font-mono">{formatPriceWithChange(candle.close, priceChanges.close)}</span>
      </span>
      {volume && (
        <span>
          V: <span className="font-mono text-blue-400">{volumeFormatter.format(volume.value)}</span>
        </span>
      )}
    </div>
  );
};
