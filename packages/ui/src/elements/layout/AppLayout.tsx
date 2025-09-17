import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'sonner';

const appLayoutStyles = cva('flex flex-col w-full', {
  variants: {
    height: {
      screen: 'min-h-screen',
      full: 'h-full',
      auto: 'h-auto',
    },
    spacing: {
      none: '',
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6',
    },
    maxWidth: {
      none: '', // 제한 없음
      // 반응형: 태블릿 1280px, PC 1920px
      responsive: 'mx-auto px-4 lg:max-w-7xl 2xl:max-w-[1920px]', // lg(1024px+)에서 1280px, 2xl(1536px+)에서 1920px
      // 고정 크기 (기존 호환성)
      tablet: 'max-w-7xl mx-auto', // 1280px 고정
      pc: 'max-w-[1920px] mx-auto', // 1920px 고정
    },
    padding: {
      none: '',
      responsive: 'px-4 lg:px-6 2xl:px-8', // 모바일 16px, 태블릿 24px, PC 32px
      sm: 'px-4',
      md: 'px-6',
      lg: 'px-8',
    },
    border: {
      none: '',
      all: 'border border-border',
      top: 'border-t border-border',
      bottom: 'border-b border-border',
      horizontal: 'border-t border-b border-border',
    },
  },
  defaultVariants: {
    height: 'screen',
    spacing: 'none',
    maxWidth: 'responsive', // 반응형을 기본값으로
    padding: 'none',
    border: 'none',
  },
});

// 메인 영역 스타일
const mainAreaStyles = cva('w-full', {
  variants: {
    grow: {
      true: 'flex-1',
      false: '',
    },
    spacing: {
      none: '',
      responsive: 'py-4 lg:py-6 2xl:py-8', // 모바일 16px, 태블릿 24px, PC 32px
      sm: 'py-2',
      md: 'py-4',
      lg: 'py-6',
    },
    border: {
      none: '',
      all: 'border border-border',
      top: 'border-t border-border',
      bottom: 'border-b border-border',
      horizontal: 'border-t border-b border-border',
    },
  },
  defaultVariants: {
    grow: true,
    spacing: 'none',
    border: 'none',
  },
});

// 헤더/푸터 스타일
const headerFooterStyles = cva('w-full', {
  variants: {
    border: {
      none: '',
      bottom: 'border-b border-border',
      top: 'border-t border-border',
    },
  },
  defaultVariants: {
    border: 'none',
  },
});

export interface AppLayoutProps extends VariantProps<typeof appLayoutStyles> {
  nav: React.ReactNode;
  logo: React.ReactNode;
  main?: React.ReactNode;
  mainSpacing?: VariantProps<typeof mainAreaStyles>['spacing'];
  mainBorder?: VariantProps<typeof mainAreaStyles>['border'];
  headerBorder?: VariantProps<typeof headerFooterStyles>['border'];
  footerBorder?: VariantProps<typeof headerFooterStyles>['border'];
  appClasses?: string;
  mainClasses?: string;
  headerClasses?: string;
  footerClasses?: string;
}

export const AppLayout = ({
  nav,
  logo,
  main,
  height = 'screen',
  spacing = 'none',
  maxWidth = 'responsive',
  padding = 'none',
  border = 'none',
  mainSpacing = 'none',
  mainBorder = 'none',
  headerBorder = 'none',
  footerBorder = 'none',
  appClasses,
  mainClasses,
  headerClasses,
  footerClasses,
}: AppLayoutProps) => {
  const defaultLayoutClasses = appLayoutStyles({ height, spacing, maxWidth, padding, border });
  const defaultMainClasses = mainAreaStyles({
    grow: true,
    spacing: mainSpacing,
    border: mainBorder,
  });
  const defaultHeaderClasses = headerFooterStyles({ border: headerBorder });
  const defaultFooterClasses = headerFooterStyles({ border: footerBorder });

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className={cn(defaultLayoutClasses, appClasses)}>
        <header className={cn(defaultHeaderClasses, headerClasses)}>
          <AppHeader nav={nav} logo={logo} />
        </header>

        <main className={cn(defaultMainClasses, mainClasses)}>{main}</main>

        <footer className={cn(defaultFooterClasses, footerClasses)}>
          <AppFooter />
        </footer>
      </div>
      <Toaster position="top-center" />
    </ThemeProvider>
  );
};
