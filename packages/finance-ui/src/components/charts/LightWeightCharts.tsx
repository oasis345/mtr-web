'use client';

import { ChartData, ChartShortTimeframe, ChartTimeframe, isShortTimeframe } from '@mtr/finance-core';
import { dayjs } from '@mtr/utils';
import {
  CandlestickSeries,
  ColorType,
  createChart,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  LogicalRange,
  TickMarkType,
} from 'lightweight-charts';
import { useTheme } from '@mtr/ui/client';
import { useEffect, useMemo, useRef } from 'react';

type LightWeightChartProps = {
  timeframe: ChartTimeframe;
  data: ChartData;
  height?: number;
  className?: string;
  onVisibleLogicalRangeChange?: (range: LogicalRange | null) => void;
};
const browserTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
const browserLocale = Intl.DateTimeFormat().resolvedOptions().locale;

export const LightWeightCharts = ({
  className,
  data,
  height = 360,
  timeframe,
  onVisibleLogicalRangeChange,
}: LightWeightChartProps) => {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi>(null);
  const chartSeriesRef = useRef<ISeriesApi<'Candlestick'>>(null);
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'>>(null);
  const { theme, resolvedTheme } = useTheme();
  const colors = useMemo(() => {
    const isDark = theme === 'dark' || resolvedTheme === 'dark';
    return {
      backgroundColor: isDark ? '#1A202C' : '#FFFFFF', // 차트 배경색
      textColor: isDark ? '#FFFFFF' : '#121212', // 텍스트 색상
      gridColor: isDark ? '#2E323E' : '#E0E0E0', // 그리드 라인 색상 (더 희미하게)
      upColor: '#2196F3', // 상승 캔들/볼륨 (파란색)
      downColor: '#EF5350', // 하락 캔들/볼륨 (빨간색)
      volumeColor: '#2196F3', // 볼륨 기본 색상
    };
  }, [theme, resolvedTheme]);

  // Create chart
  useEffect(() => {
    const showTime = isShortTimeframe(timeframe);
    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: colors.backgroundColor },
        textColor: colors.textColor,
      },
      grid: {
        vertLines: { visible: false },
        horzLines: { color: colors.gridColor },
      },
      rightPriceScale: {
        scaleMargins: { top: 0.6, bottom: 0 },
        alignLabels: true,
        borderVisible: true,
      },
      timeScale: {
        lockVisibleTimeRangeOnResize: true,
        barSpacing: 5,
        borderVisible: true,
        timeVisible: showTime,
        secondsVisible: false,
        tickMarkFormatter: (time: number, tickMarkType: TickMarkType) => {
          const utcDayjsObject = dayjs.unix(time); // <-- 변경된 부분
          const localTime = utcDayjsObject.tz(browserTimezone).locale(browserLocale);

          switch (tickMarkType) {
            case TickMarkType.Year:
              return localTime.format('YYYY');
            case TickMarkType.Month:
              return localTime.format('MM');
            case TickMarkType.DayOfMonth:
              return localTime.format('DD');
            case TickMarkType.Time:
            case TickMarkType.TimeWithSeconds:
              return localTime.format('HH:mm');
            default:
              return localTime.format('HH:mm');
          }
        },
      },
      localization: {
        locale: browserLocale,
        timeFormatter: (time: number) => {
          const showTime = Object.values(ChartShortTimeframe).includes(timeframe as ChartShortTimeframe);
          const localTime = dayjs.unix(time).tz(browserTimezone).locale(browserLocale);

          if (showTime) {
            return localTime.format('MM/DD HH:mm');
          } else {
            return localTime.format('YYYY-MM-DD');
          }
        },
      },
    });
    chartRef.current = chart;

    chartSeriesRef.current = chart.addSeries(CandlestickSeries, {
      upColor: colors.upColor,
      downColor: colors.downColor,
      wickUpColor: colors.upColor,
      wickDownColor: colors.downColor,
      priceFormat: { type: 'price' },
    });

    chart.addPane();
    chart.timeScale().subscribeVisibleLogicalRangeChange(range => {
      if (range && range.from < 10) {
        onVisibleLogicalRangeChange?.(range);
      }
    });

    volumeSeriesRef.current = chartRef.current?.addSeries(HistogramSeries, {
      color: colors.volumeColor,
      priceFormat: { type: 'volume' },
      priceLineVisible: false,
    });

    volumeSeriesRef.current.moveToPane(1);

    return () => {
      chart.remove();
    };
  }, [timeframe]);

  useEffect(() => {
    if (!chartRef.current) return;

    // Update main chart colors
    chartRef.current.applyOptions({
      layout: {
        background: { type: ColorType.Solid, color: colors.backgroundColor },
        textColor: colors.textColor,
      },
      grid: { vertLines: { visible: false }, horzLines: { color: colors.gridColor } },
    });

    // Update series colors
    chartSeriesRef.current?.applyOptions({
      upColor: colors.upColor,
      downColor: colors.downColor,
      wickUpColor: colors.upColor,
      wickDownColor: colors.downColor,
    });

    volumeSeriesRef.current?.applyOptions({
      color: colors.volumeColor,
    });
  }, [colors]);

  // Update chart series
  useEffect(() => {
    if (!data || !chartRef.current) return;

    chartSeriesRef.current?.setData(data?.candles as any);
    volumeSeriesRef.current?.setData(data?.volumes as any);
  }, [data]);

  // resize
  useEffect(() => {
    const handleResize = () => {
      chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className={className ?? 'flex flex-col  w-full'}>
      <div ref={chartContainerRef} style={{ height: height }} />
    </div>
  );
};
