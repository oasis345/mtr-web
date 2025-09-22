import { AppLayout } from '@mtr/ui';
import { AppProviders } from '@/store/AppProvider';
import './globals.css';

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
            main={children}
            nav={<div>nav</div>}
            logo={<div>logo</div>}
            height="screen"
            maxWidth="tablet"
          />
        </AppProviders>
      </body>
    </html>
  );
}
