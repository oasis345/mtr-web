import './globals.css';
import { AppProviders } from '@/store/AppProvider';
import { AppLayout } from '@mtr/ui';
import { ThemeToggle } from '@mtr/ui/client';
import Link from 'next/link';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AppProviders>
          <AppLayout
            // 기존 props 대신 children 패턴 사용
            height="screen"
            maxWidth="responsive"
          >
            <AppLayout.Header border="bottom">
              <div>
                <Link href={'/'}>MonkeyTraders</Link>
              </div>
              <div>
                <ThemeToggle />
              </div>
            </AppLayout.Header>

            <AppLayout.Main spacing="responsive">{children}</AppLayout.Main>

            <AppLayout.Footer>
              <>footer</>
            </AppLayout.Footer>
          </AppLayout>
        </AppProviders>
      </body>
    </html>
  );
}
