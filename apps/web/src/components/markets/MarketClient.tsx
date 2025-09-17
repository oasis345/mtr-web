'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  MARKET_ASSETS,
  MARKET_DATA_TYPES,
  MarketViewer,
  isMarketAsset,
  isMarketDataType,
  MarketData,
  AssetType,
  MarketDataType,
} from '@mtr/finance';
import { useAppServices } from '@mtr/ui/client';
import { Socket } from 'socket.io-client';

export function MarketPageClient({ initialData }: { initialData: MarketData[] }) {
  const [data, setData] = useState(initialData);
  const pageSymbols = useRef<Set<string>>(new Set());
  const { socketService } = useAppServices();

  // URL 상태 관리
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const assetParam = searchParams.get('asset');
  const currentAsset = isMarketAsset(assetParam) ? assetParam : AssetType.STOCKS;
  const dataTypeParam = searchParams.get('dataType');
  const currentDataType = isMarketDataType(dataTypeParam)
    ? dataTypeParam
    : MarketDataType.MOST_ACTIVE;

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    let marketSocket: Socket | null = null;

    const setupAndSubscribe = async () => {
      try {
        // 1. 소켓 생성
        marketSocket = await socketService.createChannel('market');
        marketSocket.on('market-data', (updates: MarketData[]) => {
          const visibleSymbols = pageSymbols.current;
          if (visibleSymbols.size === 0) return;

          const priceBySymbol = new Map(updates.map(u => [u.symbol, u.price]));

          setData(prev => {
            let changed = false;
            const next = prev.map(row => {
              if (!visibleSymbols.has(row.symbol)) return row;

              const nextPrice = priceBySymbol.get(row.symbol);
              if (nextPrice == null || nextPrice === row.price) return row;

              changed = true;
              return { ...row, price: nextPrice }; // ✅ 가격만 업데이트
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
          },
        });
      } catch (error) {
        console.error('Failed to setup market channel:', error);
      }
    };

    void setupAndSubscribe();

    return () => {
      console.log(`Unsubscribing from: ${currentAsset} - ${currentDataType}`);

      if (marketSocket) {
        marketSocket.emit('unsubscribe-market', {
          payload: {
            assetType: currentAsset,
            channel: currentDataType,
          },
        });
      }
    };
  }, [currentAsset, currentDataType]); // 모든 의존성 포함

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

  function handleRowClicked(data: MarketData): void {
    const { assetType, symbol } = data;
    router.push(`/${assetType}/${symbol.toLowerCase()}`);
  }

  return (
    <MarketViewer
      data={data}
      selectedAsset={currentAsset}
      selectedMarketDataType={currentDataType}
      assetTabs={MARKET_ASSETS}
      dataTypeTabs={MARKET_DATA_TYPES}
      onAssetChange={handleAssetChange}
      onMarketDataTypeChange={handleMarketDataTypeChange}
      onPageChanged={handlePageChanged}
      onRowClicked={handleRowClicked}
      showDataTypeTabs={currentAsset === AssetType.STOCKS}
      exchangeRate={1382}
    />
  );
}
