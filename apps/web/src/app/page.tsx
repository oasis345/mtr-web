import { MarketPageClient } from '@/components/markets/MarketClient';
import { appServices } from '@/service/server';
import { AssetType, FINANCIAL_ROUTES, MarketDataType, TickerData } from '@mtr/finance-core';
import { PageLayout, Section } from '@mtr/ui';

export default async function RootPage({
  searchParams,
}: {
  searchParams: Promise<{ asset?: AssetType; dataType?: MarketDataType }>;
}) {
  const { httpClient, errorService } = appServices;
  const { asset = 'crypto', dataType = 'topTraded' } = await searchParams;

  // assetType 유효성 검사
  const validAssetType = Object.values(AssetType).includes(asset as AssetType) ? asset : AssetType.STOCKS;
  let data: TickerData[] = [];

  try {
    const response = await httpClient.get<TickerData[]>(FINANCIAL_ROUTES.FINANCIAL.MARKET, {
      assetType: validAssetType,
      dataType,
    });

    data = response.statusCode === 200 ? response.data : [];
  } catch (error: unknown) {
    const normalizedError = errorService.normalize(error);
    console.error(normalizedError.getSafeMessage());
    data = [];
  }

  return (
    <PageLayout variant="sidebar" asideWidth="lg" asidePosition="right">
      <PageLayout.Main>
        <Section>
          <Section.Header>실시간 차트</Section.Header>
          <Section.Content>
            <MarketPageClient initialData={data} />
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
