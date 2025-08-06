import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import React from 'react';

const headingVariants = cva('font-semibold tracking-tight', {
  variants: {
    variant: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
    },
    size: {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    },
  },
  defaultVariants: {
    variant: 'default',
    size: 'base',
  },
});

export interface HeadingProps
  extends React.HTMLAttributes<HTMLHeadingElement>,
    VariantProps<typeof headingVariants> {
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
}

const Heading = React.forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, variant, size, as: Component = 'h1', ...props }, ref) => {
    return (
      <Component
        className={cn(headingVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Heading.displayName = 'Heading';

export { Heading, headingVariants };
