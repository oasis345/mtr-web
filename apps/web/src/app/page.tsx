import { PageLayout, Section } from '@mtr/ui';
import { appServices } from '@/service/server';
import { FINANCIAL_ROUTES } from '@mtr/finance';
import { MarketData } from '@mtr/finance/src/components/types/tabs';
import { MarketPageClient } from '@/components/markets/MarketClient';

export default async function RootPage({ searchParams }: { searchParams }) {
  const { httpClient, errorService } = appServices;
  const { assetType = 'stocks', dataType = 'mostActive' } = await searchParams;
  let data: MarketData[] = [];

  try {
    const response = await httpClient.get<MarketData[]>(FINANCIAL_ROUTES.FINANCIAL.MARKET, {
      assetType,
      dataType,
      country: 'US',
    });

    data = response.statusCode === 200 ? response.data : [];
  } catch (error: unknown) {
    const errorMessage = errorService.normalize(error);
    console.error(errorMessage);
  }

  return (
    <PageLayout
      main={
        <>
          <Section
            title="실시간 차트"
            titleAs="h1"
            titleSize="2xl"
            titleColor="default"
            padding="sm"
          >
            <MarketPageClient initialData={data} />
          </Section>

          <Section title="테스트 섹션 2">
            <div className="p-4">섹션 2 콘텐츠</div>
          </Section>
        </>
      }
      variant="sidebar"
      aside={
        <Section
          title="테스트 사이드바"
          layout="sidebar"
          titleSize="lg"
          titleColor="primary"
          padding="sm"
        >
          <div>사이드바 1 콘텐츠</div>
        </Section>
      }
      asideWidth="lg"
      asidePosition="right"
    />
  );
}
