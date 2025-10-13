import { PageLayout, Section } from '@mtr/ui';
import { appServices } from '@/service/server';
import { FINANCIAL_ROUTES, AssetType, MarketData } from '@mtr/finance-core';
import { MarketPageClient } from '@/components/markets/MarketClient';

export default async function RootPage({
  searchParams,
}: {
  searchParams: Promise<{ asset?: string; dataType?: string }>;
}) {
  const { httpClient, errorService } = appServices;
  const { asset = 'stocks', dataType = 'mostActive' } = await searchParams;

  // assetType 유효성 검사
  const validAssetType = Object.values(AssetType).includes(asset as AssetType)
    ? asset
    : AssetType.STOCKS;

  let data: MarketData[] = [];

  try {
    const response = await httpClient.get<MarketData[]>(FINANCIAL_ROUTES.FINANCIAL.MARKET, {
      assetType: validAssetType,
      dataType: asset === AssetType.STOCKS ? dataType : 'topTraded',
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
