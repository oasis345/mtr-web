'use client';

import { useAppServices } from '@/store';
import {
  AssetType,
  isMarketAsset,
  isMarketDataType,
  MARKET_SOCKET_EVENT_DATA_UPDATE,
  MARKET_SOCKET_EVENT_SUBSCRIBE,
  MARKET_SOCKET_EVENT_UNSUBSCRIBE,
  MarketDataType,
  MarketStreamData,
  TickerData,
} from '@mtr/finance-core';
import { MARKET_ASSETS_MAP, MARKET_DATA_MAP, MarketViewer, StockMarketStatusDisplay } from '@mtr/finance-ui';
import { useExchangeRate, useMarketData, useStockMarketStatus } from '@mtr/hooks';
import { useQueryClient } from '@tanstack/react-query';
import { useTheme } from 'next-themes';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';
import { Socket } from 'socket.io-client';

export function MarketPageClient() {
  const pageSymbols = useRef<Set<string>>(new Set());
  const { socketService, financialService } = useAppServices();
  const { theme } = useTheme();
  const queryClient = useQueryClient();

  // URL 상태 관리
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const assetParam = searchParams.get('asset');
  const currentAsset = isMarketAsset(assetParam) ? assetParam : AssetType.CRYPTO;
  const dataTypeParam = searchParams.get('dataType');
  const currentDataType = isMarketDataType(dataTypeParam) ? dataTypeParam : MarketDataType.TOP_TRADED;

  const { data: marketData, isLoading: isLoadingMarketData } = useMarketData({
    params: {
      assetType: currentAsset,
      dataType: currentDataType,
    },
    fetcher: financialService.getMarketData,
    pollingInterval: 10000,
    staleTime: 10000,
  });
  const { data: stockMarketStatus } = useStockMarketStatus({
    country: 'US',
    fetcher: financialService.getStockMarketStatus,
  });

  const {
    data: exchangeRate,
    isLoading: isLoadingExchangeRate,
    isError: isErrorExchangeRate,
    error: exchangeRateError,
    isSuccess: isSuccessExchangeRate,
  } = useExchangeRate({
    fetcher: financialService.getExchangeRates,
  });

  useEffect(() => {
    let marketSocket: Socket | null = null;

    const setupAndSubscribe = async () => {
      try {
        // 1. 소켓 생성
        marketSocket = await socketService.createChannel('market');
        marketSocket.on(MARKET_SOCKET_EVENT_DATA_UPDATE, (streamData: MarketStreamData<TickerData>) => {
          queryClient.setQueryData<TickerData[]>(['marketData', currentAsset, currentDataType], prev => {
            if (!prev) return [];
            let changed = false;
            const next = prev.map(row => {
              const rowSymbol = row.exchange ? row.exchange + row.symbol : row.symbol;
              const { symbol, price, assetType } = streamData.payload;
              const isEqualSymbol = rowSymbol === symbol;
              const isNextData = isEqualSymbol && assetType === row.assetType;
              if (!isNextData || price === row.price) return row;

              changed = true;
              return { ...row, ...streamData.payload };
            });

            return changed ? next : prev;
          });
        });

        marketSocket.on('disconnect', reason => {
          console.log('Market socket disconnected:', reason);
        });

        // 3. 구독 설정
        marketSocket.emit(MARKET_SOCKET_EVENT_SUBSCRIBE, {
          payload: {
            assetType: currentAsset,
            channel: currentDataType,
            dataTypes: ['ticker'],
          },
        });
      } catch (error) {
        console.error('Failed to setup market channel:', error);
      }
    };

    void setupAndSubscribe();

    const cleanup = () => {
      if (marketSocket) {
        console.log(`Unsubscribing from: ${currentAsset} - ${currentDataType}`);

        marketSocket.emit(MARKET_SOCKET_EVENT_UNSUBSCRIBE, {
          payload: {
            assetType: currentAsset,
            channel: currentDataType,
            dataTypes: ['ticker'],
          },
        });
      }
    };

    window.addEventListener('beforeunload', cleanup);
    return () => {
      window.removeEventListener('beforeunload', cleanup);
      cleanup();
    };
  }, [currentAsset, currentDataType]);

  const handleAssetChange = useCallback(
    (asset: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('asset', asset);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const handleMarketDataTypeChange = useCallback(
    (dataType: string) => {
      const params = new URLSearchParams(searchParams);
      params.set('dataType', dataType);
      router.replace(`${pathname}?${params.toString()}`);
    },
    [pathname, router, searchParams],
  );

  const handlePageChanged = useCallback((symbols: string[]) => {
    pageSymbols.current = new Set(symbols);
  }, []);

  function handleRowClicked(data: TickerData): void {
    const { assetType, symbol } = data;
    router.push(`/${assetType}/${symbol.toLowerCase()}`);
  }

  if (isLoadingMarketData || isLoadingExchangeRate) return <div>Loading...</div>;

  return (
    <div className="flex flex-col gap-4">
      {currentAsset === 'stocks' && <StockMarketStatusDisplay status={stockMarketStatus} />}
      <MarketViewer
        data={marketData}
        selectedAsset={currentAsset}
        selectedMarketDataType={currentDataType}
        assetTabs={MARKET_ASSETS_MAP}
        dataTypeTabs={MARKET_DATA_MAP}
        exchangeRate={exchangeRate}
        theme={theme}
        onAssetChange={handleAssetChange}
        onMarketDataTypeChange={handleMarketDataTypeChange}
        onPageChanged={handlePageChanged}
        onRowClicked={handleRowClicked}
      />
    </div>
  );
}
