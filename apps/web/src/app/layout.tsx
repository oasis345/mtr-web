import './globals.css';
import { AppLayout, ToastProvider } from '@mtr/ui';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppLayout
          nav={<div>nav</div>}
          logo={<div>logo</div>}
          height="screen" // min-h-screen (기본값과 동일)
          spacing="none" // 간격 없음 (기본값과 동일)
          mainPadding="none" // 메인 영역 패딩 없음 (기본값과 동일)
        >
          {children}
        </AppLayout>
        <ToastProvider />
      </body>
    </html>
  );
}
