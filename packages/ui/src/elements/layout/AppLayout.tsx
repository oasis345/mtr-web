import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { Toaster } from 'sonner';
import { cn } from '../../lib/utils';
import { AppFooter } from './AppFooter'; // AppFooter 임포트
import { AppHeader } from './AppHeader'; // AppHeader 임포트

// ... (기존 appLayoutStyles, mainAreaStyles, headerFooterStyles 등 스타일 정의는 그대로 유지)

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
      responsive: 'mx-auto px-4 lg:max-w-7xl 2xl:max-w-[1920px]',
      tablet: 'max-w-7xl mx-auto',
      pc: 'max-w-[1920px] mx-auto',
    },
    padding: {
      none: '',
      responsive: 'px-4 lg:px-6 2xl:px-8',
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
    maxWidth: 'responsive',
    padding: 'none',
    border: 'none',
  },
});

const mainAreaStyles = cva('w-full', {
  variants: {
    grow: {
      true: 'flex-1',
      false: '',
    },
    spacing: {
      none: '',
      responsive: 'py-4 lg:py-6 2xl:py-8',
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
  children: React.ReactNode;
  appClasses?: string;
}

const AppLayoutRoot = ({
  height = 'screen',
  spacing = 'none',
  maxWidth = 'responsive',
  padding = 'none',
  border = 'none',
  appClasses,
  children,
}: AppLayoutProps) => {
  const defaultLayoutClasses = appLayoutStyles({ height, spacing, maxWidth, padding, border });

  const header = React.Children.toArray(children).find(
    child => React.isValidElement(child) && (child.type as any).displayName === 'AppLayoutHeader',
  );
  const main = React.Children.toArray(children).find(
    child => React.isValidElement(child) && (child.type as any).displayName === 'AppLayoutMain',
  );
  const footer = React.Children.toArray(children).find(
    child => React.isValidElement(child) && (child.type as any).displayName === 'AppLayoutFooter',
  );

  return (
    <div className={cn(defaultLayoutClasses, appClasses)}>
      {header}
      {main}
      {footer}
      <Toaster position="top-center" />
    </div>
  );
};

// AppLayout.Header 컴포넌트 정의
interface AppLayoutHeaderProps extends VariantProps<typeof headerFooterStyles> {
  children: React.ReactNode; // 이제 AppLayout.Header의 children으로 AppHeader의 내용이 직접 들어옵니다.
  headerClasses?: string;
  // nav, logo prop은 AppLayout.Header에서 더 이상 직접 받지 않습니다.
}
const Header = ({ border = 'none', headerClasses, children }: AppLayoutHeaderProps) => {
  const defaultHeaderClasses = headerFooterStyles({ border });
  return (
    <header className={cn(defaultHeaderClasses, headerClasses)}>
      <AppHeader>{children}</AppHeader> {/* AppHeader에 children을 전달합니다. */}
    </header>
  );
};
Header.displayName = 'AppLayoutHeader';

// AppLayout.Main 컴포넌트 정의
interface AppLayoutMainProps extends VariantProps<typeof mainAreaStyles> {
  children: React.ReactNode;
  mainClasses?: string;
}
const Main = ({ grow = true, spacing = 'none', border = 'none', mainClasses, children }: AppLayoutMainProps) => {
  const defaultMainClasses = mainAreaStyles({
    grow,
    spacing,
    border,
  });
  return <main className={cn(defaultMainClasses, mainClasses)}>{children}</main>;
};
Main.displayName = 'AppLayoutMain';

// AppLayout.Footer 컴포넌트 정의
interface AppLayoutFooterProps extends VariantProps<typeof headerFooterStyles> {
  children: React.ReactNode;
  footerClasses?: string;
}
const Footer = ({ border = 'none', footerClasses, children }: AppLayoutFooterProps) => {
  const defaultFooterClasses = headerFooterStyles({ border });
  return (
    <footer className={cn(defaultFooterClasses, footerClasses)}>
      {children || <AppFooter />} {/* AppFooter를 직접 렌더링하거나 children으로 받을 수 있습니다. */}
    </footer>
  );
};
Footer.displayName = 'AppLayoutFooter';

export const AppLayout = Object.assign(AppLayoutRoot, {
  Header: Header,
  Main: Main,
  Footer: Footer,
});
