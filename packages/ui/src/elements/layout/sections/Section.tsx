import { ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';
import { Heading } from '../../typography/Heading';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../../shadcn/components/ui/card';

export const sectionVariants = cva('', {
  variants: {
    layout: {
      main: '',
      sidebar: '',
    },
    variant: {
      default: '',
      card: '',
    },
    spacing: {
      none: '',
      sm: 'mb-3',
      md: 'mb-4',
      lg: 'mb-6',
    },
    divider: {
      none: '',
      border: 'pb-4 border-b border-border last:border-b-0',
    },
  },
  compoundVariants: [
    { layout: 'main', spacing: 'lg', className: 'mb-6' },
    { layout: 'sidebar', spacing: 'md', className: 'mb-4' },
  ],
  defaultVariants: {
    layout: 'main',
    variant: 'default',
    spacing: 'md',
    divider: 'none',
  },
});

type TitleSize = 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
const titleSizeClass: Record<TitleSize, string> = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
};

export interface SectionProps extends VariantProps<typeof sectionVariants> {
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  titleSize?: TitleSize;
}

export const Section = ({
  title,
  children,
  footer,
  layout = 'main',
  variant = 'default',
  spacing = 'md',
  divider = 'none',
  titleAs = 'h2',
  titleSize = 'lg',
  className,
}: SectionProps) => {
  const Wrapper: any = layout === 'main' ? 'section' : 'div';
  const baseClasses = sectionVariants({ layout, variant, spacing, divider });

  const renderTitle = () =>
    title ? (
      <Heading as={titleAs} className={cn('mb-4 font-medium', titleSizeClass[titleSize])}>
        {title}
      </Heading>
    ) : null;

  if (variant === 'card') {
    return (
      <Wrapper className={cn(sectionVariants({ layout, spacing, divider }), className)}>
        <Card>
          {title && (
            <CardHeader>
              <CardTitle className={cn('font-medium', titleSizeClass[titleSize])}>
                {title}
              </CardTitle>
            </CardHeader>
          )}
          <CardContent>{children}</CardContent>
          {footer && <CardFooter>{footer}</CardFooter>}
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper className={cn(baseClasses, className)}>
      {renderTitle()}
      <div>{children}</div>
    </Wrapper>
  );
};
