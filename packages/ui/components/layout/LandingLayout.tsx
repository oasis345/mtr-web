import { MainHeader, MainFooter } from './component';

export type LandingLayoutProps = {
  nav: React.ReactNode;
  logo: React.ReactNode;
  children?: React.ReactNode;
};

export const LandingLayout = ({ nav, logo, children }: LandingLayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <header>
        <MainHeader nav={nav} logo={logo} />
      </header>

      <main className="flex-1 flex flex-col">
        {children}
        {/* <MainContainer section={mainSection} aside={mainAside}>
        </MainContainer> */}
      </main>

      <footer>
        <MainFooter />
      </footer>
    </div>
  );
};

// TODO sidebar(뉴스 , 환율 , 지수)
