'use client';

import { BaseTab, Combobox, LightWeightCharts } from '@mtr/ui/client';
import { CHART_LONG_TIMEFRAMES_MAP, CHART_SHORT_TIMEFRAMES_MAP } from '../const';
import { ChartLongTimeframe, ChartShortTimeframe } from '@mtr/finance-core';

type Candle = { time: number | string; open: number; high: number; low: number; close: number };
type Volume = { time: number | string; value: number; color?: string };

type AssetChartProps = {
  mode?: 'candles' | 'area';
  height?: number;
  candles?: Candle[];
  volumes?: Volume[];
  areaData?: { time: number | string; value: number }[];
  // 도메인 기본값: 코인/주식 공통 소수점
  precision?: number; // 기본 4
  showVolume?: boolean; // 기본 true
  showMA?: number[]; // 기본 [5,20,60,120]
  className?: string;
  onTimeframeChange?: (timeframe: string) => void;
};

export const AssetChart = ({
  mode = 'candles',
  height = 420,
  candles = [],
  volumes = [],
  areaData = [],
  precision = 4,
  showVolume = true,
  showMA = [5, 20, 60, 120],
  className,
  onTimeframeChange,
}: AssetChartProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Combobox
          items={[...CHART_SHORT_TIMEFRAMES_MAP]}
          defaultValue={ChartShortTimeframe.FIVE_MINUTES}
          onValueChange={onTimeframeChange}
        />
        <BaseTab
          data={CHART_LONG_TIMEFRAMES_MAP}
          defaultValue={ChartLongTimeframe.ONE_DAY}
          onValueChange={onTimeframeChange}
        />
      </div>
      <LightWeightCharts
        mode={mode}
        height={height}
        candles={candles}
        volumes={volumes}
        areaData={areaData}
        show={{ volume: showVolume, ma: showMA }}
        priceFormat={{
          type: 'price',
          precision,
          minMove: Number((1 / Math.pow(10, precision)).toFixed(precision)),
        }}
        colors={{ backgroundColor: 'transparent' }}
        className={className}
      />
    </div>
  );
};
