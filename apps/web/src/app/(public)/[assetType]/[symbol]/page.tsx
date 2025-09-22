'use client';

import dynamic from 'next/dynamic';
import { PageLayout, Section } from '@mtr/ui';
import { Suspense, use, useCallback, useEffect, useState } from 'react';
import { MarketData } from '@mtr/finance-core';
import { AssetHeader, ChartToolbar } from '@mtr/finance-ui';
import { useAppServices } from '@/store';
import { useAssets } from '@mtr/hooks';
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

  const { data, isLoading, isError, error } = useAssets({
    assetType,
    symbol,
    fetchAssets: financialService.getAssets,
  });

  const candles = [
    { time: '2018-12-22', open: 32.51, high: 32.51, low: 32.51, close: 32.51 },
    { time: '2018-12-23', open: 31.11, high: 31.11, low: 31.11, close: 31.11 },
    { time: '2018-12-24', open: 27.02, high: 27.02, low: 27.02, close: 27.02 },
    { time: '2018-12-25', open: 27.32, high: 27.32, low: 27.32, close: 27.32 },
  ];
  const volumes = [
    { time: '2018-12-22', value: 32.51 },
    { time: '2018-12-23', value: 31.11 },
    { time: '2018-12-24', value: 27.02 },
    { time: '2018-12-25', value: 27.32 },
  ];

  useEffect(() => {
    if (isError) errorService.notify(error);
  }, [isError, error]);

  if (isLoading) return <div>Loading...</div>;

  return PageLayout({
    variant: 'sidebar',
    main: (
      <>
        <Suspense fallback={<div>Loading...</div>}>
          <Section>
            <AssetHeader {...data} />
            <ChartToolbar
              interval="1m"
              onIntervalChange={() => {}}
              showMA={true}
              showVolume={true}
              onToggleMA={() => {}}
              onToggleVolume={() => {}}
            />
            <AssetChart
              mode="candles"
              candles={candles}
              volumes={volumes}
              precision={4}
              onTimeframeChange={() => {}}
            />
          </Section>
        </Suspense>

        <Section title="인기 급상승 커뮤니티" variant="card">
          <div>섹션 2 콘텐츠</div>
        </Section>
      </>
    ),
    aside: (
      <Section title="호가" variant="card">
        <div>123</div>
      </Section>
    ),
  });
}
