'use client';

import { useAppServices } from '@/store';
import {
  AssetType,
  Candle,
  CandleResponse,
  ChartData,
  ChartLongTimeframe,
  ChartShortTimeframe,
  ChartTimeframe,
  Currency,
  isCandle,
  isTrade,
  MARKET_SOCKET_EVENT_DATA_UPDATE,
  MARKET_SOCKET_EVENT_SUBSCRIBE,
  MARKET_SOCKET_EVENT_UNSUBSCRIBE,
  MarketDataType,
  MarketStreamData,
  MarketStreamDataType,
  TickerData,
  Trade,
  transformToChartData,
} from '@mtr/finance-core';

import {
  AssetChart,
  AssetHeader,
  ChartToolbar,
  CurrencyTab,
  DailyMarketPrice,
  InfiniteController,
  MARKET_PRICE_TABS_MAP,
  TradeTable,
} from '@mtr/finance-ui';
import { useCurrency, useExchangeRate, useInfiniteCandles, useMarketData, useTrades } from '@mtr/hooks';
import { PageLayout, Section } from '@mtr/ui';
import { BaseTab } from '@mtr/ui/client';
import { InfiniteData, useQueryClient } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { use, useEffect, useState } from 'react';
import type { Socket } from 'socket.io-client';

export default function AssetPage({ params }: { params: Promise<{ assetType: AssetType; symbol: string }> }) {
  const queryClient = useQueryClient();
  const { errorService, financialService, socketService } = useAppServices();
  const { assetType, symbol } = use(params);
  const [timeframe, setTimeframe] = useState<ChartTimeframe>(ChartShortTimeframe.ONE_MINUTE);
  const [marketTab, setMarketTab] = useState('daily');
  const { theme } = useTheme();

  const {
    data: exchangeRate,
    isLoading: isLoadingExchangeRate,
    isError: isErrorExchangeRate,
    error: exchangeRateError,
    isSuccess: isSuccessExchangeRate,
  } = useExchangeRate({
    fetcher: financialService.getExchangeRates,
  });

  const {
    data: assetData,
    isError: isErrorAsset,
    isLoading: isLoadingAsset,
    error: assetError,
    queryKey: assetQueryKey,
  } = useMarketData({
    params: {
      assetType: assetType,
      symbols: [symbol],
      dataType: MarketDataType.SYMBOLS,
    },
    fetcher: financialService.getMarketData,
  });

  const currentAsset = assetData?.[0];
  const { currency, setCurrency, formattedPrice } = useCurrency(exchangeRate, currentAsset, assetType);

  const {
    data: timeFrameChartData,
    fetchNextPage: fetchNextTimeFrameChartData,
    hasNextPage: hasNextTimeFrameChartData,
    isFetchingNextPage: isFetchingTimeFrameChartData,
    isError: isErrorTimeFrameChartData,
    error: timeFrameChartError,
    queryKey: timeFrameChartQueryKey,
  } = useInfiniteCandles({
    params: {
      assetType: assetType,
      symbols: [symbol],
      dataType: MarketDataType.CANDLES,
      timeframe,
    },
    fetcher: financialService.getCandles,
  });

  const {
    data: dailyChartData,
    fetchNextPage: fetchNextDailyChartData,
    hasNextPage: hasNextDailyChartData,
    isFetchingNextPage: isFetchingDailyChartData,
    isError: isErrorDailyChartData,
    error: dailyChartError,
  } = useInfiniteCandles({
    params: {
      assetType: assetType,
      symbols: [symbol],
      dataType: MarketDataType.CANDLES,
      timeframe: ChartLongTimeframe.ONE_DAY,
      limit: 200,
    },
    fetcher: financialService.getCandles,
  });

  const {
    data: tradesData,
    queryKey: tradeQueryKey,
    isError: isTradeError,
    error: tradeError,
  } = useTrades({
    params: {
      assetType: assetType,
      symbols: [symbol],
      dataType: MarketDataType.TRADES,
    },
    fetcher: financialService.getTrades,
  });

  const timeFrameController: InfiniteController<ChartData> = {
    items: transformToChartData(timeFrameChartData?.pages.flatMap(page => page.candles) ?? [], timeframe),
    loadNext: () => fetchNextTimeFrameChartData(),
    hasNext: !!hasNextTimeFrameChartData,
    isLoadingNext: isFetchingTimeFrameChartData,
  };

  const dailyController: InfiniteController<Candle[]> = {
    items: dailyChartData?.pages.flatMap(page => page.candles) ?? [],
    loadNext: () => fetchNextDailyChartData(),
    hasNext: !!hasNextDailyChartData,
    isLoadingNext: isFetchingDailyChartData,
  };

  useEffect(() => {
    let marketSocket: Socket | null = null;

    const setupMarketSocket = async () => {
      marketSocket = await socketService.createChannel('market');

      marketSocket.on(MARKET_SOCKET_EVENT_DATA_UPDATE, (updateData: MarketStreamData) => {
        if (isTrade(updateData)) {
          const newTrade = updateData.payload;

          queryClient.setQueryData<Trade[]>(tradeQueryKey, oldTrades => {
            const trades = oldTrades || [];
            const MAX_TRADES_DISPLAYED = 100;
            return [newTrade, ...trades].slice(0, MAX_TRADES_DISPLAYED);
          });

          queryClient.setQueryData<TickerData[]>(assetQueryKey, oldAssetData => {
            const oldAsset = oldAssetData?.[0];
            if (!oldAsset) return oldAssetData;

            return [
              {
                ...oldAsset,
                ...newTrade,
              },
            ];
          });
        }

        if (isCandle(updateData)) {
          const newCandle = updateData.payload;
          queryClient.setQueryData<InfiniteData<CandleResponse>>(timeFrameChartQueryKey, oldChartData => {
            if (!oldChartData) return;
            const newChartData = { ...oldChartData };
            const candles = newChartData.pages[0].candles;
            const lastCandle = candles[candles.length - 1];

            if (lastCandle.timestamp === newCandle.timestamp) {
              candles[candles.length - 1] = newCandle;
            } else {
              candles.push(newCandle);
            }
            return newChartData;
          });
        }
      });

      marketSocket.emit(MARKET_SOCKET_EVENT_SUBSCRIBE, {
        payload: {
          assetType,
          channel: MarketDataType.SYMBOLS,
          symbols: [symbol],
          dataTypes: [MarketStreamDataType.TRADE, MarketStreamDataType.CANDLE],
          timeframe,
        },
      });
    };

    void setupMarketSocket();

    return () => {
      if (marketSocket) {
        marketSocket.emit(MARKET_SOCKET_EVENT_UNSUBSCRIBE, {
          payload: {
            assetType,
            channel: MarketDataType.SYMBOLS,
            symbols: [symbol],
            dataTypes: [MarketStreamDataType.TRADE, MarketStreamDataType.CANDLE],
            timeframe,
          },
        });
      }
    };
  }, [assetType, symbol, timeframe]);

  useEffect(() => {
    if (isErrorExchangeRate) errorService.notify(exchangeRateError);
    if (isErrorAsset) errorService.notify(assetError);
    if (isErrorDailyChartData) errorService.notify(dailyChartError);
    if (isErrorTimeFrameChartData) errorService.notify(timeFrameChartError);
    if (isTradeError) errorService.notify(tradeError);
  }, [isErrorAsset, isErrorDailyChartData, isErrorTimeFrameChartData, isTradeError, isErrorExchangeRate]);

  if (isLoadingExchangeRate || isLoadingAsset) return <div>Loading...</div>;
  return (
    <PageLayout variant="sidebar">
      <PageLayout.Main>
        <Section variant="card" borderless>
          <Section.Header>
            <div className="flex  items-center gap-2">
              <div className="flex-1 justify-start">
                <AssetHeader {...currentAsset} price={formattedPrice} />
              </div>
              <div className="justify-end">
                <CurrencyTab currency={currency} onValueChange={(value: Currency) => setCurrency(value)} />
              </div>
            </div>
          </Section.Header>
          <Section.Content>
            <ChartToolbar />
            <AssetChart
              timeFrameController={timeFrameController}
              precision={4}
              assetType={assetType}
              currency={currentAsset?.currency}
              timeframe={timeframe}
              onTimeframeChange={(timeframe: ChartTimeframe) => setTimeframe(timeframe)}
            />
          </Section.Content>
        </Section>

        <Section variant="card" borderless>
          <Section.Header>
            일별 실시간 시세
            <BaseTab
              data={MARKET_PRICE_TABS_MAP}
              value={marketTab}
              onValueChange={val => setMarketTab(val)}
              variant="underline"
            />
          </Section.Header>
          <Section.Content>
            <>
              {marketTab === 'realTime' && (
                <TradeTable currency={currency} exchangeRate={exchangeRate} data={tradesData} theme={theme} />
              )}
              {marketTab === 'daily' && (
                <DailyMarketPrice
                  currency={currency}
                  exchangeRate={exchangeRate}
                  controller={dailyController}
                  theme={theme}
                />
              )}
            </>
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
