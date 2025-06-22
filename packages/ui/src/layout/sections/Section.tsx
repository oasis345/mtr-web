import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const sectionStyles = cva('', {
  variants: {
    spacing: {
      compact: 'mb-4',
      normal: 'mb-6',
      relaxed: 'mb-8',
    },
    padding: {
      none: '',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
    background: {
      none: '',
      white: 'bg-white',
      gray: 'bg-gray-50',
      card: 'bg-white shadow-sm border rounded-lg',
    },
  },
  defaultVariants: {
    spacing: 'normal',
    padding: 'none',
    background: 'none',
  },
});

const titleStyles = cva('font-bold mb-4', {
  variants: {
    size: {
      sm: 'text-lg',
      md: 'text-xl',
      lg: 'text-2xl',
      xl: 'text-3xl',
    },
    color: {
      default: 'text-gray-900',
      muted: 'text-gray-700',
      primary: 'text-blue-600',
    },
  },
  defaultVariants: {
    size: 'lg',
    color: 'default',
  },
});

export interface SectionProps extends VariantProps<typeof sectionStyles> {
  title?: string;
  children: ReactNode;
  className?: string;
  titleSize?: VariantProps<typeof titleStyles>['size'];
  titleColor?: VariantProps<typeof titleStyles>['color'];
}

export const Section = ({
  title,
  children,
  spacing = 'normal',
  padding = 'none',
  background = 'none',
  titleSize = 'lg',
  titleColor = 'default',
  className,
}: SectionProps) => (
  <section className={cn(sectionStyles({ spacing, padding, background }), className)}>
    {title && <h2 className={titleStyles({ size: titleSize, color: titleColor })}>{title}</h2>}
    {children}
  </section>
);
