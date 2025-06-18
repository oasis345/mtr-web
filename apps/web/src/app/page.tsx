import { PageLayout, Section, SidebarSection } from '@mtr/ui';

export default function Home() {
  return (
    <PageLayout
      variant="sidebar"
      aside={
        <SidebarSection title="테스트 사이드바" titleSize="lg" titleColor="primary">
          <div>사이드바 1 콘텐츠</div>
        </SidebarSection>
      }
      asideWidth="lg"
      asidePosition="right"
    >
      <Section title="테스트 섹션 1">
        <div className="p-4">테스트 섹션 1 콘텐츠</div>
      </Section>

      <Section title="테스트 섹션 2">
        <div className="p-4">섹션 2 콘텐츠</div>
      </Section>
    </PageLayout>
  );
}
