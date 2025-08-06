'use client';
import { BaseGrid, BaseTab } from '@mtr/ui/client';
import type { MarketCategory, MarketData, TimeRange } from './types/tabs';
import { MARKET_CATEGORIES, TIME_RANGES } from './model/marketTabs';
import { marketColumns } from './model/maketColumns';

export interface MarketViewerProps {
  data: MarketData[];
  selectedCategory?: MarketCategory;
  selectedTimeRange?: TimeRange;
  onCategoryChange: (category: MarketCategory) => void;
  onTimeRangeChange: (timeRange: TimeRange) => void;
}

export const MarketViewer = ({
  data,
  selectedCategory,
  selectedTimeRange,
  onCategoryChange,
  onTimeRangeChange,
}: MarketViewerProps) => {
  return (
    <>
      <BaseTab
        data={MARKET_CATEGORIES}
        defaultValue={selectedCategory}
        onValueChange={onCategoryChange}
      />

      <BaseTab
        data={TIME_RANGES}
        defaultValue={selectedTimeRange}
        onValueChange={onTimeRangeChange}
        variant="underline"
      />

      <BaseGrid data={data} columns={marketColumns} />
    </>
  );
};
