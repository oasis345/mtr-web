import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { AppHeader } from './AppHeader';
import { AppFooter } from './AppFooter';

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
  },
  defaultVariants: {
    height: 'screen',
    spacing: 'none',
  },
});

// 메인 영역 스타일
const mainAreaStyles = cva('', {
  variants: {
    grow: {
      true: 'flex-1',
      false: '',
    },
    padding: {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    },
  },
  defaultVariants: {
    grow: true,
    padding: 'none',
  },
});

export interface AppLayoutProps extends VariantProps<typeof appLayoutStyles> {
  nav: React.ReactNode;
  logo: React.ReactNode;
  main?: React.ReactNode;
  mainPadding?: VariantProps<typeof mainAreaStyles>['padding'];
  className?: string;
}

export const AppLayout = ({
  nav,
  logo,
  main,
  height = 'screen',
  spacing = 'none',
  mainPadding = 'none',
  className,
}: AppLayoutProps) => {
  const layoutClasses = appLayoutStyles({ height, spacing });
  const mainClasses = mainAreaStyles({ grow: true, padding: mainPadding });

  return (
    <div className={cn(layoutClasses, className)}>
      <header>
        <AppHeader nav={nav} logo={logo} />
      </header>

      <main className={mainClasses}>{main}</main>

      <footer>
        <AppFooter />
      </footer>
    </div>
  );
};
