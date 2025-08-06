import { PageLayout, Section } from '@mtr/ui';
import { MarketViewer } from '@mtr/finance';

export default function RootPage() {
  const data = [
    { symbol: 'AAPL', name: 'Apple', price: 150.75, changePercent: 0.02, volume: 1000000 },
    { symbol: 'GOOG', name: 'Google', price: 2800.5, changePercent: 0.01, volume: 500000 },
    {
      symbol: 'MSFT',
      name: 'Microsoft',
      price: 210.22,
      changePercent: 0.03,
      volume: 800000,
    },
  ];

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
            <MarketViewer data={data} />
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
