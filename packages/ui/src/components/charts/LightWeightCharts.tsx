'use client';

import { useEffect, useMemo, useRef } from 'react';
import {
  createChart,
  ColorType,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  AreaSeries,
  CandlestickSeries,
  HistogramSeries,
  LineSeries,
} from 'lightweight-charts';

type AreaPoint = { time: number | string; value: number };
type Candle = { time: number | string; open: number; high: number; low: number; close: number };
type Volume = { time: number | string; value: number; color?: string };

type Mode = 'area' | 'candles';

type ChartColors = {
  backgroundColor?: string;
  textColor?: string;
  gridColor?: string;
  upColor?: string;
  downColor?: string;
  lineColor?: string;
  areaTopColor?: string;
  areaBottomColor?: string;
  volumeColor?: string;
};

type PriceFormat =
  | { type: 'price'; precision?: number; minMove?: number }
  | { type: 'volume' }
  | { type: 'custom'; formatter: (price: number) => string };

type ShowOptions = {
  volume?: boolean;
  ma?: number[]; // 예: [5,20,60,120]
};

type LightWeightChartProps = {
  mode?: Mode;
  height?: number;
  className?: string;
  colors?: ChartColors;
  priceFormat?: PriceFormat;

  // 데이터
  areaData?: AreaPoint[];
  candles?: Candle[];
  volumes?: Volume[];

  // 표시 옵션
  show?: ShowOptions;
};

const defaultColors: Required<ChartColors> = {
  backgroundColor: 'transparent',
  textColor: '#e5e7eb',
  gridColor: '#1f2937',
  upColor: '#22c55e',
  downColor: '#ef4444',
  lineColor: '#2962FF',
  areaTopColor: '#2962FF',
  areaBottomColor: 'rgba(41, 98, 255, 0.28)',
  volumeColor: '#60a5fa',
};

const sma = (period: number, data: Candle[]): AreaPoint[] => {
  if (!period || period < 1 || data.length === 0) return [];
  let sum = 0;
  const out: AreaPoint[] = [];
  for (let i = 0; i < data.length; i++) {
    sum += data[i].close;
    if (i >= period) sum -= data[i - period].close;
    if (i >= period - 1) {
      out.push({ time: data[i].time, value: +(sum / period).toFixed(6) });
    }
  }
  return out;
};

export const LightWeightCharts = ({
  mode = 'candles',
  height = 360,
  className,
  colors,
  priceFormat,
  areaData = [],
  candles = [],
  volumes = [],
  show = { volume: true, ma: [5, 20, 60, 120] },
}: LightWeightChartProps) => {
  const palette = { ...defaultColors, ...(colors || {}) };
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const mainSeriesRef = useRef<ISeriesApi<'Area' | 'Candlestick'> | null>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'> | null>(null);
  const maSeriesRefs = useRef<ISeriesApi<'Line'>[]>([]);

  const maLines = useMemo(
    () => (mode === 'candles' && show.ma?.length ? show.ma : []),
    [mode, show.ma],
  );
  const computedMA = useMemo(
    () =>
      mode === 'candles' && maLines.length ? maLines.map(p => ({ p, data: sma(p, candles) })) : [],
    [mode, maLines, candles],
  );

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: palette.backgroundColor },
        textColor: palette.textColor,
      },
      width: containerRef.current.clientWidth,
      height,
      rightPriceScale: {
        borderVisible: false,
        scaleMargins: { top: 0.1, bottom: show.volume ? 0.25 : 0.1 },
      },
      timeScale: { borderVisible: false, timeVisible: true, secondsVisible: false },
      grid: { vertLines: { visible: false }, horzLines: { color: palette.gridColor } },
    });

    if (mode === 'area') {
      const series = chart.addSeries(AreaSeries, {
        lineColor: palette.lineColor,
        topColor: palette.areaTopColor,
        bottomColor: palette.areaBottomColor,
        priceFormat:
          priceFormat?.type === 'price'
            ? priceFormat
            : { type: 'price', precision: 2, minMove: 0.01 },
      });
      series.setData(areaData);
      mainSeriesRef.current = series as unknown as ISeriesApi<'Area' | 'Candlestick'>;
    } else {
      const series = chart.addSeries(CandlestickSeries, {
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
      series.setData(candles);
      mainSeriesRef.current = series as unknown as ISeriesApi<'Area' | 'Candlestick'>;

      if (show.volume) {
        const vs = chart.addSeries(HistogramSeries, {
          priceFormat: { type: 'volume' },
          priceScaleId: '',
          base: 0,
          color: palette.volumeColor,
          scaleMargins: { top: 0.8, bottom: 0 },
        });
        vs.setData(volumes.length ? volumes : candles.map(c => ({ time: c.time, value: 0 })));
        volumeSeriesRef.current = vs;
      }

      maSeriesRefs.current = [];
      computedMA.forEach(({ p, data }, idx) => {
        const line = chart.addSeries(LineSeries, {
          priceLineVisible: false,
          lineWidth: 2,
          lineStyle: LineStyle.Solid,
          color: ['#60a5fa', '#a78bfa', '#f59e0b', '#10b981'][idx % 4],
        });
        line.setData(data);
        maSeriesRefs.current.push(line);
      });
    }

    chart.timeScale().fitContent();
    const onResize = () => {
      if (!containerRef.current) return;
      chart.applyOptions({ width: containerRef.current.clientWidth });
    };
    window.addEventListener('resize', onResize);
    onResize();

    chartRef.current = chart;
    return () => {
      window.removeEventListener('resize', onResize);
      chart.remove();
      chartRef.current = null;
      mainSeriesRef.current = null;
      volumeSeriesRef.current = null;
      maSeriesRefs.current = [];
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, height, palette.backgroundColor, palette.textColor, palette.gridColor, show.volume]);

  useEffect(() => {
    if (mode === 'area' && mainSeriesRef.current && 'setData' in mainSeriesRef.current) {
      (mainSeriesRef.current as any).setData(areaData);
    }
  }, [mode, areaData]);

  useEffect(() => {
    if (mode !== 'candles') return;
    if (mainSeriesRef.current) (mainSeriesRef.current as any).setData(candles);
    if (show.volume && volumeSeriesRef.current && volumes) volumeSeriesRef.current.setData(volumes);
    maSeriesRefs.current.forEach((s, i) => s.setData(computedMA[i]?.data ?? []));
  }, [mode, candles, volumes, computedMA, show.volume]);

  return <div ref={containerRef} className={className ?? 'w-full'} />;
};
