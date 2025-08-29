'use client';
import { BaseGrid, BaseTab } from '@mtr/ui/client';
import type {
  MarketAsset,
  MarketData,
  MarketDataType,
  MarketDataTypeTab,
  MarketTab,
} from './types/tabs';
import { ColDef } from 'ag-grid-community';

export interface MarketViewerProps {
  data: MarketData[];
  columns: ColDef<MarketData>[];
  assetTabs: MarketTab[];
  dataTypeTabs: MarketDataTypeTab[];
  selectedAsset?: MarketAsset;
  selectedMarketDataType?: MarketDataType;
  onAssetChange?: (category: MarketAsset) => void;
  onMarketDataTypeChange?: (marketDataType: MarketDataType) => void;
}

export const MarketViewer = ({
  assetTabs,
  dataTypeTabs,
  data,
  columns,
  selectedAsset,
  selectedMarketDataType,
  onAssetChange,
  onMarketDataTypeChange,
}: MarketViewerProps) => {
  return (
    <>
      <div className="flex gap-4 mb-4">
        <BaseTab data={assetTabs} defaultValue={selectedAsset} onValueChange={onAssetChange} />

        <BaseTab
          data={dataTypeTabs}
          defaultValue={selectedMarketDataType}
          onValueChange={onMarketDataTypeChange}
        />
      </div>

      {/* <BaseTab
        data={TIME_RANGES}
        defaultValue={selectedTimeRange}
        onValueChange={onTimeRangeChange}
        variant="underline"
      /> */}

      <BaseGrid data={data} columns={columns} />
    </>
  );
};
