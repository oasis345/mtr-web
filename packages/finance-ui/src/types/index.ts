import { ColDef } from 'ag-grid-community';
import { AssetType, MarketDataType } from '@mtr/finance-core';
import { MarketData } from '@mtr/finance-core';

export interface MarketTab {
  label: string;
  value: AssetType;
}

export interface MarketDataTypeTab {
  label: string;
  value: MarketDataType;
}

export type MarketPriceTab = {
  label: string;
  value: 'realTime' | 'daily';
};

export interface MarketDataEvent {
  symbol: string;
  price: number;
  change: number;
  volume: number;
  timestamp: number;
}

export interface MarketViewerProps {
  data: MarketData[];
  columns?: ColDef<MarketData>[];
  assetTabs: MarketTab[];
  dataTypeTabs: MarketDataTypeTab[];
  selectedAsset?: AssetType;
  selectedMarketDataType?: MarketDataType;
  showDataTypeTabs?: boolean;
  onAssetChange?: (category: AssetType) => void;
  onMarketDataTypeChange?: (marketDataType: MarketDataType) => void;
  onPageChanged?: (symbols: string[]) => void;
  onRowClicked?: (data: MarketData) => void;
  exchangeRate?: number;
}

export type InfiniteController<T> = {
  items: T[];
  loadNext: () => void;
  hasNext: boolean;
  isLoadingNext: boolean;
};
