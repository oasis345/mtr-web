import { cn } from '../../lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const skeletonVariants = cva('animate-pulse rounded-md bg-muted', {
  variants: {
    variant: {
      default: 'bg-muted',
      card: 'bg-card border',
      text: 'bg-muted/60',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface LoadingSkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  lines?: number;
  avatar?: boolean;
}

export const LoadingSkeleton = ({
  className,
  variant,
  lines = 1,
  avatar = false,
  ...props
}: LoadingSkeletonProps) => {
  if (lines === 1 && !avatar) {
    return (
      <div className={cn(skeletonVariants({ variant }), 'h-4 w-full', className)} {...props} />
    );
  }

  return (
    <div className={cn('space-y-2', className)} {...props}>
      {avatar && (
        <div className="flex items-center space-x-4">
          <div className={cn(skeletonVariants({ variant }), 'h-12 w-12 rounded-full')} />
          <div className="space-y-2">
            <div className={cn(skeletonVariants({ variant }), 'h-4 w-[250px]')} />
            <div className={cn(skeletonVariants({ variant }), 'h-4 w-[200px]')} />
          </div>
        </div>
      )}
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(skeletonVariants({ variant }), 'h-4', i === lines - 1 ? 'w-3/4' : 'w-full')}
        />
      ))}
    </div>
  );
};
