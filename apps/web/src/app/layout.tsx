import './globals.css';
import { LandingLayout } from '@mtr/ui';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <LandingLayout nav={<div>nav</div>} logo={<div>logo</div>}>
          {children}
        </LandingLayout>
      </body>
    </html>
  );
}
