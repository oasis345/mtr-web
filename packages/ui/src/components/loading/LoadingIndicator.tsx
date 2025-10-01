'use client';

import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const loadingVariants = cva('inline-flex items-center justify-center', {
  variants: {
    variant: {
      default: 'text-primary',
      muted: 'text-muted-foreground',
      destructive: 'text-destructive',
    },
    size: {
      sm: 'h-4 w-4',
      default: 'h-6 w-6',
      lg: 'h-8 w-8',
      xl: 'h-12 w-12',
    },
    type: {
      spinner: '',
      dots: 'space-x-1',
      pulse: '',
      bars: 'space-x-1',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'default',
    type: 'spinner',
  },
});

export interface LoadingIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof loadingVariants> {
  text?: string;
  fullScreen?: boolean;
}

// Spinner 컴포넌트
const Spinner = ({ className }: { className?: string }) => (
  <svg
    className={cn('animate-spin', className)}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

// Dots 컴포넌트
const Dots = ({ className }: { className?: string }) => (
  <>
    <div
      className={cn('animate-bounce rounded-full bg-current', className)}
      style={{ animationDelay: '0ms' }}
    />
    <div
      className={cn('animate-bounce rounded-full bg-current', className)}
      style={{ animationDelay: '150ms' }}
    />
    <div
      className={cn('animate-bounce rounded-full bg-current', className)}
      style={{ animationDelay: '300ms' }}
    />
  </>
);

// Pulse 컴포넌트
const Pulse = ({ className }: { className?: string }) => (
  <div className={cn('animate-pulse rounded-full bg-current', className)} />
);

// Bars 컴포넌트
const Bars = ({ className }: { className?: string }) => (
  <>
    <div
      className={cn('animate-pulse bg-current rounded-sm', className)}
      style={{ animationDelay: '0ms', height: '100%', width: '3px' }}
    />
    <div
      className={cn('animate-pulse bg-current rounded-sm', className)}
      style={{ animationDelay: '150ms', height: '60%', width: '3px' }}
    />
    <div
      className={cn('animate-pulse bg-current rounded-sm', className)}
      style={{ animationDelay: '300ms', height: '100%', width: '3px' }}
    />
    <div
      className={cn('animate-pulse bg-current rounded-sm', className)}
      style={{ animationDelay: '450ms', height: '80%', width: '3px' }}
    />
  </>
);

export const LoadingIndicator = ({
  className,
  variant,
  size,
  type,
  text,
  fullScreen = false,
  ...props
}: LoadingIndicatorProps) => {
  const baseClasses = loadingVariants({ variant, size, type });

  const renderIndicator = () => {
    // 크기 매핑 수정
    const indicatorClass = cn({
      'h-4 w-4': size === 'sm',
      'h-6 w-6': size === 'default',
      'h-8 w-8': size === 'lg',
      'h-12 w-12': size === 'xl',
    });

    switch (type) {
      case 'dots':
        return <Dots className={indicatorClass} />;
      case 'pulse':
        return <Pulse className={indicatorClass} />;
      case 'bars':
        return <Bars className={indicatorClass} />;
      default:
        return <Spinner className={indicatorClass} />;
    }
  };

  const content = (
    <div className={cn(baseClasses, 'p-2', className)} {...props}>
      {renderIndicator()}
      {text && (
        <span
          className={cn('ml-2 font-medium', {
            'text-xs': size === 'sm',
            'text-sm': size === 'default',
            'text-base': size === 'lg',
            'text-lg': size === 'xl',
          })}
        >
          {text}
        </span>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm">
        {content}
      </div>
    );
  }

  return content;
};
