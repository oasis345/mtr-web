import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const pageLayoutStyles = cva('w-full', {
  variants: {
    variant: {
      fullwidth: 'w-full',
      sidebar: 'flex flex-row h-full gap-6', // 사이드바와 메인 사이 간격
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    variant: 'fullwidth',
    padding: 'md', // AppLayout과 중복 방지를 위해 기본 패딩
  },
});

const mainContentStyles = cva('', {
  variants: {
    variant: {
      fullwidth: 'w-full',
      sidebar: 'flex-1 min-w-0', // min-w-0으로 축소 가능하게
    },
  },
  defaultVariants: {
    variant: 'fullwidth',
  },
});

const sidebarStyles = cva('flex-shrink-0', {
  variants: {
    width: {
      // 1280px 기준 최적화 (태블릿)
      sm: 'w-64', // 256px (20% of 1280px)
      md: 'w-80', // 320px (25% of 1280px)
      lg: 'w-96', // 384px (30% of 1280px)

      // 반응형 최적화: 화면 크기에 따른 비율 조정
      optimal: 'w-64 lg:w-80 2xl:w-96', // 태블릿 20% → PC 25%
      wide: 'w-80 lg:w-96 2xl:w-[448px]', // 태블릿 25% → PC 30%

      // 고정 크기 (특별한 용도)
      narrow: 'w-56', // 224px
      extra: 'w-[512px]', // 512px (대형 사이드바)
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: {
    width: 'optimal', // 최적화된 반응형 너비
    padding: 'md',
  },
});

export interface PageLayoutProps extends VariantProps<typeof pageLayoutStyles> {
  main: ReactNode;
  aside?: ReactNode;
  asideWidth?: VariantProps<typeof sidebarStyles>['width'];
  asidePosition?: 'left' | 'right';
  asidePadding?: VariantProps<typeof sidebarStyles>['padding'];
  pageClasses?: string;
  mainClasses?: string;
  asideClasses?: string;
}

export const PageLayout = ({
  variant = 'fullwidth',
  padding = 'md',
  main,
  aside,
  asideWidth = 'optimal',
  asidePosition = 'right',
  asidePadding = 'md',
  pageClasses,
  mainClasses,
  asideClasses,
}: PageLayoutProps) => {
  const layoutClasses = pageLayoutStyles({ variant, padding });
  const contentClasses = mainContentStyles({ variant });
  const sidebarClasses = sidebarStyles({
    width: asideWidth,
    padding: asidePadding,
  });

  if (variant === 'sidebar' && aside) {
    return (
      <div className={cn(layoutClasses, pageClasses)}>
        {asidePosition === 'left' && (
          <aside className={cn(sidebarClasses, asideClasses)}>{aside}</aside>
        )}
        <main className={cn(contentClasses, mainClasses)}>{main}</main>
        {asidePosition === 'right' && (
          <aside className={cn(sidebarClasses, asideClasses)}>{aside}</aside>
        )}
      </div>
    );
  }

  return (
    <div className={cn(layoutClasses, pageClasses)}>
      <main className={cn(contentClasses, mainClasses)}>{main}</main>
    </div>
  );
};
