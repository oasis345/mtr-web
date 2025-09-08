import { AppLayout } from '@mtr/ui';
import { ServiceProvider } from '@/store/provider';
import './globals.css';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ServiceProvider>
          <AppLayout
            main={children}
            nav={<div>nav</div>}
            logo={<div>logo</div>}
            height="screen"
            maxWidth="tablet"
          />
        </ServiceProvider>
      </body>
    </html>
  );
}
