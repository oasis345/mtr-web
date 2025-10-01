'use client';

import { Combobox } from '@mtr/ui/client';
import { LightWeightCharts } from './charts';
import { CHART_LONG_TIMEFRAMES_MAP, CHART_SHORT_TIMEFRAMES_MAP } from '../const';
import { AssetType, ChartTimeframe, Currency } from '@mtr/finance-core';

type Candle = { time: number | string; open: number; high: number; low: number; close: number };
type Volume = { time: number | string; value: number; color?: string };

type AssetChartProps = {
  height?: number;
  assetType?: AssetType;
  currency?: Currency;
  candles?: Candle[];
  volumes?: Volume[];
  areaData?: { time: number | string; value: number }[];
  // 도메인 기본값: 코인/주식 공통 소수점
  precision?: number; // 기본 4
  showVolume?: boolean; // 기본 true
  showMA?: number[]; // 기본 [5,20,60,120]
  className?: string;
  defaultTimeframe?: ChartTimeframe;
  onTimeframeChange?: (timeframe: ChartTimeframe) => void;
};

export const AssetChart = ({
  height = 420,
  candles = [],
  volumes = [],
  areaData = [],
  precision = 4,
  showVolume = true,
  showMA = [5, 20, 60, 120],
  className,
  assetType,
  currency,
  onTimeframeChange,
  defaultTimeframe,
}: AssetChartProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-2">
        <Combobox
          items={[...CHART_SHORT_TIMEFRAMES_MAP, ...CHART_LONG_TIMEFRAMES_MAP]}
          defaultValue={defaultTimeframe}
          onValueChange={onTimeframeChange}
        />
      </div>
      <LightWeightCharts
        height={height}
        assetType={assetType}
        currency={currency}
        candles={candles}
        volumes={volumes}
        areaData={areaData}
        show={{ volume: showVolume, ma: showMA }}
        showOHLC={true} // OHLC 정보 표시
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
