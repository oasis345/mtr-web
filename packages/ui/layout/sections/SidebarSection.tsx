import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const sidebarSectionStyles = cva('', {
  variants: {
    spacing: {
      compact: 'mb-3',
      normal: 'mb-4',
      relaxed: 'mb-6',
    },
    divider: {
      none: '',
      border: 'pb-4 border-b border-gray-200 last:border-b-0',
      shadow: 'pb-4 shadow-sm last:shadow-none',
    },
  },
  defaultVariants: {
    spacing: 'normal',
    divider: 'none',
  },
});

const titleStyles = cva('font-medium mb-3', {
  variants: {
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
    color: {
      default: 'text-gray-800',
      muted: 'text-gray-600',
      primary: 'text-blue-600',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'default',
  },
});

const contentStyles = cva('', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
    color: {
      default: 'text-gray-900',
      muted: 'text-gray-600',
      light: 'text-gray-500',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'muted',
  },
});

export interface SidebarSectionProps extends VariantProps<typeof sidebarSectionStyles> {
  title?: string;
  children: ReactNode;
  className?: string;
  titleSize?: VariantProps<typeof titleStyles>['size'];
  titleColor?: VariantProps<typeof titleStyles>['color'];
  contentSize?: VariantProps<typeof contentStyles>['size'];
  contentColor?: VariantProps<typeof contentStyles>['color'];
}

export const SidebarSection = ({
  title,
  children,
  spacing = 'normal',
  divider = 'none',
  titleSize = 'md',
  titleColor = 'default',
  contentSize = 'md',
  contentColor = 'muted',
  className,
}: SidebarSectionProps) => (
  <div className={cn(sidebarSectionStyles({ spacing, divider }), className)}>
    {title && <h3 className={titleStyles({ size: titleSize, color: titleColor })}>{title}</h3>}
    <div className={contentStyles({ size: contentSize, color: contentColor })}>{children}</div>
  </div>
);
