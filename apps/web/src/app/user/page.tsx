import { PageLayout, Section, SidebarSection } from '@mtr/ui';

export default function UserPage() {
  return (
    <PageLayout
      variant="sidebar"
      aside={
        <>
          <SidebarSection title="사용자 메뉴" divider="border" titleColor="primary">
            <ul className="space-y-2">
              <li>
                <a href="/profile" className="hover:text-blue-600 transition-colors">
                  프로필 수정
                </a>
              </li>
              <li>
                <a href="/settings" className="hover:text-blue-600 transition-colors">
                  계정 설정
                </a>
              </li>
              <li>
                <a href="/notifications" className="hover:text-blue-600 transition-colors">
                  알림 설정
                </a>
              </li>
            </ul>
          </SidebarSection>

          <SidebarSection
            title="통계"
            spacing="relaxed"
            divider="border"
            titleSize="sm"
            contentSize="sm"
          >
            <div className="space-y-2">
              <div className="flex justify-between">
                <span>이번 달 로그인</span>
                <span className="font-medium">23회</span>
              </div>
              <div className="flex justify-between">
                <span>전체 포인트</span>
                <span className="font-medium text-green-600">1,250점</span>
              </div>
              <div className="flex justify-between">
                <span>가입일</span>
                <span>2024.01.15</span>
              </div>
            </div>
          </SidebarSection>

          <SidebarSection
            title="최근 활동"
            titleSize="sm"
            titleColor="muted"
            contentSize="sm"
            contentColor="light"
          >
            <ul className="space-y-1">
              <li className="flex justify-between">
                <span>프로필 수정</span>
                <span className="text-xs">2시간 전</span>
              </li>
              <li className="flex justify-between">
                <span>로그인</span>
                <span className="text-xs">오늘</span>
              </li>
              <li className="flex justify-between">
                <span>설정 변경</span>
                <span className="text-xs">어제</span>
              </li>
            </ul>
          </SidebarSection>

          <SidebarSection title="빠른 액션" spacing="compact" titleSize="sm">
            <div className="grid grid-cols-1 gap-2">
              <button className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors">
                새 게시글
              </button>
              <button className="px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded hover:bg-gray-100 transition-colors">
                메시지 보내기
              </button>
            </div>
          </SidebarSection>
        </>
      }
    >
      <Section title="사용자 대시보드" background="card" padding="md" spacing="relaxed">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-4">환영합니다!</h3>
            <p className="text-gray-600 mb-4">
              사용자 대시보드에 오신 것을 환영합니다. 여기서 계정 정보를 관리하고 활동을 확인할 수
              있습니다.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded">
                <h4 className="font-medium text-blue-900">총 게시글</h4>
                <p className="text-2xl font-bold text-blue-600">42</p>
              </div>
              <div className="bg-green-50 p-4 rounded">
                <h4 className="font-medium text-green-900">받은 좋아요</h4>
                <p className="text-2xl font-bold text-green-600">128</p>
              </div>
              <div className="bg-purple-50 p-4 rounded">
                <h4 className="font-medium text-purple-900">팔로워</h4>
                <p className="text-2xl font-bold text-purple-600">67</p>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section
        title="최근 게시글"
        titleSize="md"
        background="white"
        padding="md"
        spacing="normal"
        className="shadow-sm border rounded-lg"
      >
        <div className="space-y-3">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-medium">React 컴포넌트 디자인 패턴</h4>
            <p className="text-sm text-gray-600">3일 전 • 좋아요 12개</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-medium">TypeScript 타입 안전성</h4>
            <p className="text-sm text-gray-600">1주 전 • 좋아요 8개</p>
          </div>
          <div className="border-l-4 border-purple-500 pl-4">
            <h4 className="font-medium">CVA를 활용한 컴포넌트</h4>
            <p className="text-sm text-gray-600">2주 전 • 좋아요 15개</p>
          </div>
        </div>
      </Section>
    </PageLayout>
  );
}
