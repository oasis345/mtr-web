'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import {
  MARKET_ASSETS,
  MARKET_DATA_TYPES,
  MarketViewer,
  isMarketAsset,
  isMarketDataType,
} from '@mtr/finance';
import { MarketAsset, MarketData, MarketDataType } from '@mtr/finance/src/components/types/tabs';
import { useAppServices } from '@mtr/ui/client';

export function MarketPageClient({ initialData }: { initialData: MarketData[] }) {
  const [data, setData] = useState(initialData);
  const [pageSymbols, setPageSymbols] = useState<string[]>([]);
  const { socketService } = useAppServices();

  // URL 상태 관리
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const assetParam = searchParams.get('asset');
  const currentAsset = isMarketAsset(assetParam) ? assetParam : MarketAsset.STOCKS;
  const dataTypeParam = searchParams.get('dataType');
  const currentDataType = isMarketDataType(dataTypeParam)
    ? dataTypeParam
    : MarketDataType.MOST_ACTIVE;

  // ✅ initialData가 변경되면 상태 업데이트
  useEffect(() => {
    console.log('InitialData changed:', initialData.length, 'items');
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    let marketSocket: any = null;

    const setupAndSubscribe = async () => {
      try {
        console.log('Setting up socket and subscribing...');

        // 1. 소켓 생성
        marketSocket = await socketService.createChannel('market');

        // 2. 이벤트 리스너 설정
        marketSocket.on('market-data', (updates: MarketData[]) => {
          // updates: [{ symbol, price, ... }] 형태라고 가정
          if (!Array.isArray(updates) || updates.length === 0 || pageSymbols.length === 0) return;

          const visible = new Set(pageSymbols);
          const priceBySymbol = new Map(updates.map(u => [u.symbol, u.price]));

          setData(prev => {
            let changed = false;
            const next = prev.map(row => {
              if (!visible.has(row.symbol)) return row;

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
        console.log(`Subscribing to: ${currentAsset} - ${currentDataType}`);
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

      socketService.disconnectAll();
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
    setPageSymbols(symbols);
  }, []);

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
    />
  );
}
