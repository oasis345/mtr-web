'use client';

import dynamic from 'next/dynamic';
import { PageLayout, Section } from '@mtr/ui';
import { Suspense, use, useEffect, useMemo, useState } from 'react';
import {
  AssetHeader,
  ChartToolbar,
  CURRENCY_MAP,
  DailyMarketPrice,
  InfiniteController,
} from '@mtr/finance-ui';
import { useAppServices } from '@/store';
import { useAssets, useCandles, useCurrency, useInfiniteCandles } from '@mtr/hooks';
import {
  AssetType,
  Candle,
  ChartData,
  ChartLongTimeframe,
  ChartTimeframe,
  convertCurrency,
  Currency,
  formatPrice,
  MarketDataType,
  transformToChartData,
} from '@mtr/finance-core';
import { BaseTab, LoadingIndicator, LoadingSkeleton } from '@mtr/ui/client';
import { dayjs } from '@mtr/utils';
const AssetChart = dynamic(() => import('@mtr/finance-ui').then(mod => mod.AssetChart), {
  ssr: false,
});

export default function AssetPage({
  params,
}: {
  params: Promise<{ assetType: string; symbol: string }>;
}) {
  const { errorService, financialService } = useAppServices();
  const { assetType, symbol } = use(params);
  const [timeframe, setTimeframe] = useState<ChartTimeframe>(ChartLongTimeframe.ONE_WEEK);

  const candleParams = useMemo(
    () => ({
      assetType: assetType as AssetType,
      symbols: [symbol],
      dataType: MarketDataType.CANDLES,
      timeframe,
    }),
    [assetType, symbol, timeframe],
  );

  const {
    data: assetData,
    isLoading: isLoadingAsset,
    isError: isErrorAsset,
    error: errorAsset,
  } = useAssets({
    params: {
      assetType: assetType as AssetType,
      symbols: [symbol],
      dataType: MarketDataType.SYMBOL,
    },
    fetcher: financialService.getAssets,
  });

  const { currency, setCurrency, formattedPrice } = useCurrency(
    1300,
    assetData,
    assetType as AssetType,
  );

  // const {
  //   data: chartData,
  //   isLoading: isLoadingChart,
  //   isError: isErrorChart,
  //   error: errorChart,
  // } = useCandles({
  //   params: {
  //     assetType: assetType as AssetType,
  //     symbols: [symbol],
  //     dataType: MarketDataType.CANDLES,
  //     timeframe,
  //   },
  //   fetcher: financialService.getCandles,
  // });

  const timeFrameChartInfiniteQuery = useInfiniteCandles(
    {
      assetType: assetType as AssetType,
      symbols: [symbol],
      dataType: MarketDataType.CANDLES,
      timeframe,
    },
    financialService.getCandles,
  );

  const dailyChartInfiniteQuery = useInfiniteCandles(
    {
      assetType: assetType as AssetType,
      symbols: [symbol],
      dataType: MarketDataType.CANDLES,
      timeframe: ChartLongTimeframe.ONE_DAY,
      limit: 200,
    },
    financialService.getCandles,
  );

  const timeFrameController: InfiniteController<ChartData> = {
    items: transformToChartData(
      timeFrameChartInfiniteQuery.data?.pages.flatMap(page => page.candles) ?? [],
      timeframe,
    ),
    loadNext: () => timeFrameChartInfiniteQuery.fetchNextPage(),
    hasNext: !!timeFrameChartInfiniteQuery.hasNextPage,
    isLoadingNext: timeFrameChartInfiniteQuery.isFetchingNextPage,
  };

  const dailyController: InfiniteController<Candle> = {
    items: dailyChartInfiniteQuery.data?.pages.flatMap(page => page.candles) ?? [],
    loadNext: () => dailyChartInfiniteQuery.fetchNextPage(),
    hasNext: !!dailyChartInfiniteQuery.hasNextPage,
    isLoadingNext: dailyChartInfiniteQuery.isFetchingNextPage,
  };

  useEffect(() => {
    if (isErrorAsset) errorService.notify(errorAsset);
  }, [isErrorAsset]);

  return (
    <PageLayout variant="sidebar">
      <PageLayout.Main>
        <Section variant="card" borderless>
          <Section.Header>
            <div className="flex  items-center gap-2">
              <div className="flex-1 justify-start">
                <AssetHeader {...assetData} price={formattedPrice} />
              </div>
              <div className="justify-end">
                <BaseTab
                  data={CURRENCY_MAP}
                  defaultValue={currency}
                  onValueChange={value => setCurrency(value as Currency)}
                />
              </div>
            </div>
          </Section.Header>
          <Section.Content>
            <ChartToolbar />
            <AssetChart
              timeFrameController={timeFrameController}
              precision={4}
              assetType={assetType as AssetType}
              currency={assetData?.currency}
              timeframe={timeframe}
              onTimeframeChange={(timeframe: ChartTimeframe) => setTimeframe(timeframe)}
            />
          </Section.Content>
        </Section>

        <Section variant="card" borderless>
          <Section.Header>일별 실시간 시세</Section.Header>
          <Section.Content>
            <DailyMarketPrice currency={currency} controller={dailyController} />
          </Section.Content>
        </Section>
      </PageLayout.Main>

      <PageLayout.Aside>
        <Section variant="card" borderless>
          <Section.Header>호가</Section.Header>
          <Section.Content>
            <div>123</div>
          </Section.Content>
        </Section>
      </PageLayout.Aside>
    </PageLayout>
  );
}
