'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  createChart,
  ColorType,
  type IChartApi,
  type ISeriesApi,
  CandlestickSeries,
  HistogramSeries,
  MouseEventParams,
  LogicalRange,
  SeriesDefinition,
  CrosshairMode,
} from 'lightweight-charts';
import { OHLCInfo } from '../OHLCinfo';
import {
  AssetType,
  Candle,
  ChartData,
  ChartShortTimeframe,
  ChartTimeframe,
  Currency,
} from '@mtr/finance-core';

type LightWeightChartProps = {
  timeframe: ChartTimeframe;
  data: ChartData[];
  height?: number;
  className?: string;
  onVisibleLogicalRangeChange?: (range: LogicalRange | null) => void;
};

const DefaultColors = {
  backgroundColor: 'transparent',
  textColor: '#e5e7eb',
  gridColor: '#1f2937',
  upColor: '#ef4444',
  downColor: '#3b82f6',
  volumeColor: '#ef4444',
};

export const LightWeightCharts = ({
  className,
  data,
  height = 360,
  timeframe,
  onVisibleLogicalRangeChange,
}: LightWeightChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>(null);
  const chartSeriesRef = useRef<ISeriesApi<CandlestickSeries>>(null);
  const volumeContainerRef = useRef<HTMLDivElement>(null);
  const volumeChartRef = useRef<IChartApi>(null);
  const volumeSeriesRef = useRef<ISeriesApi<HistogramSeries>>(null);
  const chartHeight = useMemo(() => height * 0.5, [height]);
  const volumeHeight = useMemo(() => height * 0.5, [height]);

  // Create chart
  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#e5e7eb',
      },
      grid: { vertLines: { visible: false }, horzLines: { color: DefaultColors.gridColor } },
      timeScale: {
        visible: false,
        lockVisibleTimeRangeOnResize: true,
      },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.4,
          bottom: 0,
        },
        alignLabels: true,
      },
    });
    chartRef.current = chart;

    chartSeriesRef.current = chart.addSeries(CandlestickSeries, {
      upColor: DefaultColors.upColor,
      downColor: DefaultColors.downColor,
      wickUpColor: DefaultColors.upColor,
      wickDownColor: DefaultColors.downColor,
      borderVisible: false,
      priceFormat: { type: 'price' },
    });

    chart.timeScale().subscribeVisibleLogicalRangeChange(range => {
      volumeChartRef.current.timeScale().setVisibleLogicalRange(range);

      if (range && range.from < 10) {
        onVisibleLogicalRangeChange?.(range);
      }
    });

    return () => {
      chart.remove();
    };
  }, [timeframe]);

  // create volume
  useEffect(() => {
    const showTime = Object.values(ChartShortTimeframe).includes(timeframe);
    const volume = createChart(volumeContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: '#e5e7eb',
      },
      grid: { vertLines: { visible: false }, horzLines: { color: DefaultColors.gridColor } },
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: {
          top: 0.4,
          bottom: 0,
        },
        alignLabels: true,
      },
      timeScale: {
        borderVisible: true,
        timeVisible: showTime,
        secondsVisible: false,
        lockVisibleTimeRangeOnResize: true,
      },
    });
    volumeChartRef.current = volume;
    volumeSeriesRef.current = volume.addSeries(HistogramSeries, {
      color: DefaultColors.volumeColor,
      priceFormat: { type: 'volume' },
      priceLineVisible: false,
    });
    volume.timeScale().applyOptions({ barSpacing: 10 });
    volume.timeScale().subscribeVisibleLogicalRangeChange(range => {
      chartRef.current.timeScale().setVisibleLogicalRange(range);
    });

    return () => {
      volumeChartRef.current.remove();
    };
  }, [timeframe]);

  // Update chart series
  useEffect(() => {
    if (!data || !chartRef.current) return;

    chartSeriesRef.current?.setData(data?.candles);
    volumeSeriesRef.current?.setData(data?.volumes);
    // const visbleFrom = data?.candles.length - 50;
    // const visbleTo = data?.candles.length;
    // chartRef.current.timeScale().setVisibleLogicalRange({ from: visbleFrom, to: visbleTo });
    // volumeChartRef.current.timeScale().setVisibleLogicalRange({ from: visbleFrom, to: visbleTo });
  }, [data]);

  // resize
  useEffect(() => {
    const handleResize = () => {
      chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      volumeChartRef.current.applyOptions({ width: volumeContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // sync crosshair
  useEffect(() => {
    if (
      !chartRef.current ||
      !volumeChartRef.current ||
      !data?.candles?.length ||
      !data?.volumes?.length
    )
      return;

    const getCrosshairDataPoint = (series, param) => {
      if (!param.time) {
        return null;
      }
      const dataPoint = param.seriesData.get(series);
      return dataPoint || null;
    };

    const syncCrosshair = (chart, series, dataPoint) => {
      if (dataPoint) {
        chart.setCrosshairPosition(dataPoint.value, dataPoint.time, series);
        return;
      }
      chart.clearCrosshairPosition();
    };

    const chartToVolumeHandler = param => {
      const point = getCrosshairDataPoint(chartSeriesRef.current, param);
      syncCrosshair(volumeChartRef.current, volumeSeriesRef.current, point);
    };

    const volumeToChartHandler = param => {
      const point = getCrosshairDataPoint(volumeSeriesRef.current, param);
      syncCrosshair(chartRef.current, chartSeriesRef.current, point);
    };

    chartRef.current.subscribeCrosshairMove(chartToVolumeHandler);
    volumeChartRef.current.subscribeCrosshairMove(volumeToChartHandler);

    return () => {
      chartRef.current.unsubscribeCrosshairMove(chartToVolumeHandler);
      volumeChartRef.current.unsubscribeCrosshairMove(volumeToChartHandler);
    };

    console.log('syncCrosshair', data);
  }, [timeframe, data]);

  return (
    <div className={className ?? 'flex flex-col gap-y-2 w-full'}>
      <div ref={chartContainerRef} style={{ height: chartHeight }} />
      <div ref={volumeContainerRef} style={{ height: volumeHeight }} />
    </div>
  );
};
