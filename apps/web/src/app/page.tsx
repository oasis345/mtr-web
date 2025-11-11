import { MarketPageClient } from '@/components/markets/MarketClient';
import { appServices } from '@/service/server';
import { Hydrate } from '@/store/Hydrate';
import { AssetType, MarketDataType } from '@mtr/finance-core';
import { PageLayout, Section } from '@mtr/ui';
import { dehydrate, QueryClient } from '@tanstack/react-query';

export default async function RootPage({
  searchParams,
}: {
  searchParams: Promise<{ asset?: AssetType; dataType?: MarketDataType }>;
}) {
  const { financialService } = appServices;
  const { asset = AssetType.CRYPTO, dataType = MarketDataType.TOP_TRADED } = await searchParams;
  const queryClient = new QueryClient();
  const queryKey = ['marketData', asset, dataType];
  await queryClient.prefetchQuery({
    queryKey: queryKey,
    queryFn: () =>
      financialService.getMarketData({
        assetType: asset as AssetType,
        dataType: dataType as MarketDataType,
      }),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <PageLayout variant="sidebar" asideWidth="lg" asidePosition="right">
      <PageLayout.Main>
        <Section>
          <Section.Header>실시간 차트</Section.Header>
          <Section.Content>
            <Hydrate state={dehydratedState}>
              <MarketPageClient />
            </Hydrate>
          </Section.Content>
        </Section>
        <Section>
          <Section.Header>인기 급상승 커뮤니티</Section.Header>
          <Section.Content>
            <div>섹션 2 콘텐츠</div>
          </Section.Content>
        </Section>
      </PageLayout.Main>
      <PageLayout.Aside>
        <Section>
          <Section.Header>테스트 사이드바</Section.Header>
          <Section.Content>
            <div>사이드바 1 콘텐츠</div>
          </Section.Content>
        </Section>
      </PageLayout.Aside>
    </PageLayout>
  );
}
