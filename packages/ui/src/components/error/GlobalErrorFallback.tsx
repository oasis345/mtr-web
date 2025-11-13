import React from 'react';
interface GlobalErrorFallbackProps {
  error: Error;
  reset: () => void;
  /**
   * 앱별 브랜딩 정보
   */
  branding?: {
    appName: string;
    supportEmail?: string;
    logoUrl?: string;
  };
  /**
   * 환경별 설정
   */
  environment?: 'development' | 'production';
}
/**
 * 모노레포 공통 글로벌 에러 폴백 컴포넌트
 */
export const GlobalErrorFallback: React.FC<GlobalErrorFallbackProps> = ({
  error,
  reset,
  branding = { appName: 'Application' },
  environment = process.env.NODE_ENV as 'development' | 'production',
}) => {
  const handleReportError = () => {
    const subject = encodeURIComponent(`${branding.appName} 오류 신고`);
    const body = encodeURIComponent(`
오류 정보:
- 메시지: ${error.message}
- 시간: ${new Date().toLocaleString()}
추가 설명:
[여기에 오류 발생 상황을 설명해주세요]
    `);
    if (branding.supportEmail) {
      window.location.href = `mailto:${branding.supportEmail}?subject=${subject}&body=${body}`;
    } else {
      // 기본 신고 방식 (예: 고객센터 페이지로 이동)
      window.open('/support', '_blank');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-2xl p-8 text-center">
        {/* 로고 또는 아이콘 */}
        {branding.logoUrl ? (
          <img src={branding.logoUrl} alt={branding.appName} className="w-16 h-16 mx-auto mb-6" />
        ) : (
          <div className="text-7xl mb-6">:경광등:</div>
        )}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">앗! 문제가 발생했어요</h1>
        <p className="text-gray-600 mb-6 text-lg">
          {branding.appName}에서 예상치 못한 오류가 발생했습니다.
          <br />
          잠시 후 다시 시도해주세요.
        </p>
        {/* 개발 환경 상세 정보 */}
        {environment === 'development' && (
          <div className="mb-6 text-left bg-red-50 border border-red-200 rounded-lg p-4">
            <details>
              <summary className="cursor-pointer font-semibold text-red-800 hover:text-red-900">
                :렌치: 개발자 정보 (클릭하여 확인)
              </summary>
              <div className="mt-3 space-y-3 text-sm">
                <div>
                  <span className="font-medium text-red-700">메시지:</span>
                  <p className="text-red-600 font-mono bg-red-100 p-2 rounded mt-1 break-all">{error.message}</p>
                </div>
                {error.stack && (
                  <div>
                    <span className="font-medium text-red-700">스택 트레이스:</span>
                    <pre className="text-red-600 font-mono bg-red-100 p-2 rounded mt-1 text-xs overflow-auto max-h-32">
                      {error.stack}
                    </pre>
                  </div>
                )}
              </div>
            </details>
          </div>
        )}
        {/* 액션 버튼들 */}
        <div className="space-y-3">
          <div className="flex gap-3 justify-center">
            <button
              onClick={reset}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              :시계_반대_방향_화살표: 다시 시도
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              :시계_반대_방향_화살표: 새로고침
            </button>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => (window.location.href = '/')}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
            >
              :집: 홈으로
            </button>
            <button
              onClick={handleReportError}
              className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
            >
              :이메일: 문제 신고
            </button>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t border-gray-200 text-xs text-gray-500">
          <p>오류 발생 시간: {new Date().toLocaleString()}</p>
          {branding.supportEmail && (
            <p className="mt-1">
              문의:{' '}
              <a href={`mailto:${branding.supportEmail}`} className="text-blue-600 hover:underline">
                {branding.supportEmail}
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
