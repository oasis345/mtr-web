import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';

const pageLayoutStyles = cva('w-full', {
  variants: {
    variant: {
      fullwidth: 'w-full',
      sidebar: 'flex flex-row h-full',
    },
  },
  defaultVariants: {
    variant: 'fullwidth',
  },
});

const mainContentStyles = cva('p-6', {
  variants: {
    variant: {
      fullwidth: 'w-full',
      sidebar: 'flex-1',
    },
  },
  defaultVariants: {
    variant: 'fullwidth',
  },
});

const sidebarStyles = cva('flex-shrink-0 p-6', {
  variants: {
    width: {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
    },
  },
  defaultVariants: {
    width: 'md',
  },
});

export interface PageLayoutProps extends VariantProps<typeof pageLayoutStyles> {
  children: ReactNode;
  aside?: ReactNode;
  asideWidth?: VariantProps<typeof sidebarStyles>['width'];
  asidePosition?: 'left' | 'right';
  className?: string;
}

export const PageLayout = ({
  variant = 'fullwidth',
  children,
  aside,
  asideWidth = 'md',
  asidePosition = 'right',
  className,
}: PageLayoutProps) => {
  const layoutClasses = pageLayoutStyles({ variant });
  const contentClasses = mainContentStyles({ variant });
  const sidebarClasses = sidebarStyles({ width: asideWidth });

  if (variant === 'sidebar' && aside) {
    return (
      <div className={cn(layoutClasses, className)}>
        {asidePosition === 'left' && <aside className={sidebarClasses}>{aside}</aside>}
        <div className={contentClasses}>{children}</div>
        {asidePosition === 'right' && <aside className={sidebarClasses}>{aside}</aside>}
      </div>
    );
  }

  return (
    <div className={cn(layoutClasses, className)}>
      <div className={contentClasses}>{children}</div>
    </div>
  );
};
