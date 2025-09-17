import { AssetType, MarketDataType } from '../types';

export const isMarketAsset = (value: string | null): value is AssetType => {
  if (!value) return false;
  return Object.values(AssetType).includes(value as AssetType);
};

export const isMarketDataType = (value: string | null): value is MarketDataType => {
  if (!value) return false;
  return Object.values(MarketDataType).includes(value as MarketDataType);
};
