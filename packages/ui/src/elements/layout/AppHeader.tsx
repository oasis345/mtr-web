import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { cn } from '../../lib/utils'; // 경로 확인 필요

const appHeaderStyles = cva('sticky top-0 z-50 w-full', {
  variants: {
    height: {
      default: 'h-16', // 기본 높이
      lg: 'h-20', // 더 큰 높이
    },
    padding: {
      default: 'px-4', // 기본 패딩
      lg: 'px-6', // 더 큰 패딩
    },
  },
  defaultVariants: {
    height: 'default',
    padding: 'default',
  },
});

export interface AppHeaderProps extends VariantProps<typeof appHeaderStyles> {
  children?: React.ReactNode; // 이제 AppHeader의 모든 내용은 children으로 전달됩니다.
}

export const AppHeader = ({
  height = 'default',
  padding = 'default',
  children, // children을 받습니다.
}: AppHeaderProps) => {
  return (
    <header className={cn(appHeaderStyles({ height, padding }))}>
      <div className="flex h-full items-center justify-between">
        {children} {/* children을 렌더링합니다. */}
      </div>
    </header>
  );
};
