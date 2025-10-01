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
} from 'lightweight-charts';
import { OHLCInfo } from '../OHLCinfo';

// Type definitions (Area 관련 제거)
type Candle = { time: number | string; open: number; high: number; low: number; close: number };
type Volume = { time: number | string; value: number; color?: string };
type ChartColors = {
  backgroundColor?: string;
  textColor?: string;
  gridColor?: string;
  upColor?: string;
  downColor?: string;
  volumeColor?: string;
};
type PriceFormat =
  | { type: 'price'; precision?: number; minMove?: number }
  | { type: 'volume' }
  | { type: 'custom'; formatter: (price: number) => string };
type ShowOptions = {
  volume?: boolean;
};
type LightWeightChartProps = {
  height?: number;
  className?: string;
  colors?: ChartColors;
  priceFormat?: PriceFormat;
  candles?: Candle[];
  volumes?: Volume[];
  show?: ShowOptions;
  showOHLC?: boolean;
};

const defaultColors: Required<ChartColors> = {
  backgroundColor: 'transparent',
  textColor: '#e5e7eb',
  gridColor: '#1f2937',
  upColor: '#ef4444', // 상승 캔들 = 빨간색 (red-500)
  downColor: '#3b82f6', // 하락 캔들 = 파란색 (blue-500)
  volumeColor: '#ef4444',
};

export const LightWeightCharts = ({
  height = 360,
  className,
  colors,
  priceFormat,
  candles = [],
  volumes = [],
  show = { volume: true },
  showOHLC = true,
  currency = 'USD',
  assetType,
}: LightWeightChartProps) => {
  const palette = useMemo(() => ({ ...defaultColors, ...(colors || {}) }), [colors]);

  const mainContainerRef = useRef<HTMLDivElement | null>(null);
  const volumeContainerRef = useRef<HTMLDivElement | null>(null);
  const mainChartRef = useRef<IChartApi | null>(null);
  const volumeChartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);

  const [currentCandle, setCurrentCandle] = useState<Candle | undefined>();
  const [currentVolume, setCurrentVolume] = useState<Volume | undefined>();

  const transformedVolumes = useMemo(() => {
    return volumes.map(v => {
      const correspondingCandle = candles.find(c => c.time === v.time);
      return {
        ...v,
        color:
          v.color ||
          (correspondingCandle && correspondingCandle.close >= correspondingCandle.open
            ? `${palette.upColor}CC` // 상승: 빨강 (80% 불투명도)
            : `${palette.downColor}CC`), // 하락: 파랑 (80% 불투명도)
      };
    });
  }, [volumes, candles, palette.upColor, palette.downColor]);

  const mainHeight = show.volume ? Math.floor(height * 0.7) : height;
  const volumeHeight = show.volume ? Math.floor(height * 0.3) : 0;

  useEffect(() => {
    if (candles.length > 0) setCurrentCandle(candles[candles.length - 1]);
    if (volumes.length > 0) setCurrentVolume(volumes[volumes.length - 1]);
  }, [candles, volumes]);

  // 메인 차트 생성 + 시리즈 생성 (통합)
  useEffect(() => {
    if (!mainContainerRef.current) return;

    const chart = createChart(mainContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: palette.backgroundColor },
        textColor: palette.textColor,
      },
      width: mainContainerRef.current.clientWidth,
      height: mainHeight,
      rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.1, bottom: 0.1 } },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
        visible: !show.volume,
      },
      grid: { vertLines: { visible: false }, horzLines: { color: palette.gridColor } },
    });

    // 캔들스틱 시리즈 생성
    const mainSeries = chart.addSeries(CandlestickSeries, {
      upColor: palette.upColor,
      downColor: palette.downColor,
      wickUpColor: palette.upColor,
      wickDownColor: palette.downColor,
      borderVisible: false,
      priceFormat:
        priceFormat?.type === 'price'
          ? priceFormat
          : { type: 'price', precision: 4, minMove: 0.0001 },
    });
    mainSeries.setData(candles);

    mainChartRef.current = chart;
    mainSeriesRef.current = mainSeries;

    if (candles.length > 0) {
      chart.timeScale().fitContent();
    }

    const resizeHandler = () => chart.applyOptions({ width: mainContainerRef.current.clientWidth });
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      chart.remove();
      mainChartRef.current = null;
      mainSeriesRef.current = null;
    };
  }, [mainHeight, palette, priceFormat, show.volume]);

  // 볼륨 차트 생성 + 시리즈 생성 (통합)
  useEffect(() => {
    if (!show.volume || !volumeContainerRef.current) return;

    const chart = createChart(volumeContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: palette.backgroundColor },
        textColor: palette.textColor,
      },
      width: volumeContainerRef.current.clientWidth,
      height: volumeHeight,
      rightPriceScale: { borderVisible: false, scaleMargins: { top: 0.2, bottom: 0 } },
      timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
      grid: { vertLines: { visible: false }, horzLines: { color: palette.gridColor } },
    });

    // 볼륨 시리즈 생성
    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      base: 0,
    });
    volumeSeries.setData(transformedVolumes);

    volumeChartRef.current = chart;
    volumeSeriesRef.current = volumeSeries;

    const resizeHandler = () =>
      chart.applyOptions({ width: volumeContainerRef.current.clientWidth });
    window.addEventListener('resize', resizeHandler);

    return () => {
      window.removeEventListener('resize', resizeHandler);
      chart.remove();
      volumeChartRef.current = null;
      volumeSeriesRef.current = null;
    };
  }, [show.volume, volumeHeight, palette]);

  // 데이터 업데이트 (차트 재생성 없이)
  useEffect(() => {
    if (mainSeriesRef.current) {
      mainSeriesRef.current.setData(candles);
      if (candles.length > 0) mainChartRef.current?.timeScale().fitContent();
    }
  }, [candles]);

  useEffect(() => {
    if (volumeSeriesRef.current) {
      volumeSeriesRef.current.setData(transformedVolumes);
    }
  }, [transformedVolumes]);

  // 이벤트 핸들러 & 동기화
  useEffect(() => {
    const mainChart = mainChartRef.current;
    const volumeChart = volumeChartRef.current;
    if (!mainChart || !volumeChart) return;

    const syncHandler = (range: any) => {
      if (range) volumeChart.timeScale().setVisibleRange(range);
    };
    mainChart.timeScale().subscribeVisibleTimeRangeChange(syncHandler);

    const crosshairHandler = (param: MouseEventParams) => {
      const time = param.time;
      if (!time) {
        setCurrentCandle(candles[candles.length - 1]);
        setCurrentVolume(volumes[volumes.length - 1]);
        return;
      }
      const candle = candles.find(c => c.time === time);
      const volume = volumes.find(v => v.time === time);
      if (candle) setCurrentCandle(candle);
      if (volume) setCurrentVolume(volume);
    };
    mainChart.subscribeCrosshairMove(crosshairHandler);

    return () => {
      mainChart.timeScale().unsubscribeVisibleTimeRangeChange(syncHandler);
      mainChart.unsubscribeCrosshairMove(crosshairHandler);
    };
  }, [candles, volumes, show.volume]);

  return (
    <div className={className ?? 'w-full'}>
      {showOHLC && (
        <OHLCInfo
          candle={currentCandle}
          volume={currentVolume}
          currency={currency}
          assetType={assetType}
        />
      )}
      <div ref={mainContainerRef} style={{ height: mainHeight }} />
      {show.volume && <div ref={volumeContainerRef} style={{ height: volumeHeight }} />}
    </div>
  );
};
