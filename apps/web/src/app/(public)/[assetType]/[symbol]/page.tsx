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
  ChartLongTimeframe,
  ChartTimeframe,
  convertCurrency,
  Currency,
  formatPrice,
  MarketDataType,
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
  const [timeframe, setTimeframe] = useState<ChartTimeframe>(ChartLongTimeframe.ONE_MONTH);

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

  const {
    data: chartData,
    isLoading: isLoadingChart,
    isError: isErrorChart,
    error: errorChart,
  } = useCandles({
    params: {
      assetType: assetType as AssetType,
      symbols: [symbol],
      dataType: MarketDataType.CANDLES,
      timeframe,
    },
    fetcher: financialService.getCandles,
  });

  // useInfiniteQuery 훅 호출
  const infiniteQuery = useInfiniteCandles(
    {
      assetType: assetType as AssetType,
      symbols: [symbol],
      dataType: MarketDataType.CANDLES,
      timeframe: ChartLongTimeframe.ONE_DAY,
      limit: 100,
    },
    financialService.getCandles,
  );

  const controller: InfiniteController<Candle> = {
    items: infiniteQuery.data ?? [],
    loadNext: () => infiniteQuery.fetchNextPage(),
    hasNext: !!infiniteQuery.hasNextPage,
    isLoadingNext: infiniteQuery.isFetchingNextPage,
  };

  useEffect(() => {
    if (isErrorAsset) errorService.notify(errorAsset);
    if (isErrorChart) errorService.notify(errorChart);
    if (infiniteQuery.isError) errorService.notify(infiniteQuery.error);
  }, [isErrorAsset, isErrorChart, infiniteQuery.isError]);

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
              candles={chartData?.candles}
              volumes={chartData?.volumes}
              precision={4}
              defaultTimeframe={timeframe}
              assetType={assetType as AssetType}
              currency={assetData?.currency}
              onTimeframeChange={(timeframe: ChartTimeframe) => setTimeframe(timeframe)}
            />
          </Section.Content>
        </Section>

        <Section variant="card" borderless>
          <Section.Header>일별 실시간 시세</Section.Header>
          <Section.Content>
            <DailyMarketPrice currency={currency} controller={controller} />
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
