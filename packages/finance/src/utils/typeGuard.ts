import { MarketAsset, MarketDataType } from '../components/types/tabs';

export const isMarketAsset = (value: string | null): value is MarketAsset => {
  if (!value) return false;
  return Object.values(MarketAsset).includes(value as MarketAsset);
};

export const isMarketDataType = (value: string | null): value is MarketDataType => {
  if (!value) return false;
  return Object.values(MarketDataType).includes(value as MarketDataType);
};
