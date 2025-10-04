'use client';

import { useMemo, useRef, useState } from 'react';
import _ from 'lodash';
import { type LogicalRange } from 'lightweight-charts';
import { Combobox } from '@mtr/ui/client';
import { LightWeightCharts } from './charts';
import { CHART_LONG_TIMEFRAMES_MAP, CHART_SHORT_TIMEFRAMES_MAP } from '../const';
import { AssetType, ChartData, ChartTimeframe, Currency } from '@mtr/finance-core';
import { InfiniteController } from '../types';

type AssetChartProps = {
  height?: number;
  assetType?: AssetType;
  currency?: Currency;
  timeFrameController?: InfiniteController<ChartData>;
  precision?: number;
  showVolume?: boolean;
  className?: string;
  defaultTimeframe?: ChartTimeframe;
  timeframe?: ChartTimeframe;
  onTimeframeChange?: (timeframe: ChartTimeframe) => void;
};

export const AssetChart = ({
  height = 420,
  timeFrameController,
  className,
  timeframe,
  onTimeframeChange,
}: AssetChartProps) => {
  const { items, loadNext, hasNext, isLoadingNext } = timeFrameController || {};

  const controllerStateRef = useRef({ loadNext, hasNext, isLoadingNext });
  controllerStateRef.current = { loadNext, hasNext, isLoadingNext };

  const handleVisibleLogicalRangeChange = useMemo(
    () =>
      _.debounce((range: LogicalRange | null) => {
        const { hasNext, isLoadingNext, loadNext } = controllerStateRef.current;

        if (!range || !hasNext || isLoadingNext || !loadNext) {
          return;
        }

        if (hasNext) {
          loadNext();
        }
      }, 300),
    [], // 의존성 배열을 비워 함수가 절대 재생성되지 않도록 합니다.
  );

  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Combobox
          value={timeframe}
          items={[...CHART_SHORT_TIMEFRAMES_MAP, ...CHART_LONG_TIMEFRAMES_MAP]}
          onValueChange={(timeframe: ChartTimeframe) => {
            onTimeframeChange?.(timeframe);
          }}
        />
      </div>
      <LightWeightCharts
        height={height}
        timeframe={timeframe}
        data={items}
        className={className}
        onVisibleLogicalRangeChange={handleVisibleLogicalRangeChange}
      />
    </div>
  );
};
