'use client';

import { useAppServices } from '@/store';
import {
  AssetType,
  isMarketAsset,
  isMarketDataType,
  MarketData,
  MarketDataType,
  MarketStreamData,
} from '@mtr/finance-core';
import { MARKET_ASSETS_MAP, MARKET_DATA_MAP, MarketViewer, StockMarketStatusDisplay } from '@mtr/finance-ui';
import { useExchangeRate, useStockMarketStatus } from '@mtr/hooks';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Socket } from 'socket.io-client';

export function MarketPageClient({ initialData }: { initialData: MarketData[] }) {
  const [data, setData] = useState(initialData);
  const pageSymbols = useRef<Set<string>>(new Set());
  const { socketService, financialService } = useAppServices();

  // URL 상태 관리
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const assetParam = searchParams.get('asset');
  const currentAsset = isMarketAsset(assetParam) ? assetParam : AssetType.CRYPTO;
  const dataTypeParam = searchParams.get('dataType');
  const currentDataType = isMarketDataType(dataTypeParam)
    ? dataTypeParam
    : currentAsset === AssetType.CRYPTO
      ? MarketDataType.TOP_TRADED
      : MarketDataType.MOST_ACTIVE;

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
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    let marketSocket: Socket | null = null;

    const setupAndSubscribe = async () => {
      try {
        // 1. 소켓 생성
        marketSocket = await socketService.createChannel('market');
        marketSocket.on('market-data', (streamData: MarketStreamData<MarketData>) => {
          console.log('Received market data update:', streamData);
          const visibleSymbols = pageSymbols.current;
          if (visibleSymbols.size === 0) return;

          setData(prev => {
            let changed = false;
            const next = prev.map(row => {
              if (!visibleSymbols.has(row.symbol)) return row;

              const isNextData =
                streamData.payload.symbol === row.symbol && streamData.payload.assetType === row.assetType;
              if (!isNextData || streamData.payload.price === row.price) return row;

              changed = true;
              return { ...row, ...streamData.payload }; // ✅ 가격만 업데이트
            });

            return changed ? next : prev; // 변경 없으면 리렌더 방지
          });
        });

        marketSocket.on('disconnect', reason => {
          console.log('Market socket disconnected:', reason);
        });

        // 3. 구독 설정
        marketSocket.emit('subscribe-market', {
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

        marketSocket.emit('unsubscribe-market', {
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
      if (asset === AssetType.STOCKS) {
        params.set('dataType', MarketDataType.MOST_ACTIVE);
      } else {
        params.set('dataType', MarketDataType.TOP_TRADED);
      }
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

  function handleRowClicked(data: MarketData): void {
    const { assetType, symbol } = data;
    router.push(`/${assetType}/${symbol.toLowerCase()}`);
  }

  return (
    <div className="flex flex-col gap-4">
      {currentAsset === 'stocks' && <StockMarketStatusDisplay status={stockMarketStatus} />}
      <MarketViewer
        data={data}
        selectedAsset={currentAsset}
        selectedMarketDataType={currentDataType}
        assetTabs={MARKET_ASSETS_MAP}
        dataTypeTabs={MARKET_DATA_MAP}
        onAssetChange={handleAssetChange}
        onMarketDataTypeChange={handleMarketDataTypeChange}
        onPageChanged={handlePageChanged}
        onRowClicked={handleRowClicked}
        showDataTypeTabs={currentAsset === AssetType.STOCKS}
        exchangeRate={exchangeRate}
      />
    </div>
  );
}
