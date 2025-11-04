import { cva, type VariantProps } from 'class-variance-authority';
import React, { Children, isValidElement, ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../../shadcn/components/ui/card';

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
  },
  defaultVariants: {
    layout: 'main',
    variant: 'default',
    spacing: 'md',
  },
});

// --- Compound Components ---
const Header = ({ children }: { children: ReactNode }): ReactNode => <>{children}</>;
Header.displayName = 'Section.Header';

const Content = ({ children }: { children: ReactNode }): ReactNode => <>{children}</>;
Content.displayName = 'Section.Content';

const Footer = ({ children }: { children: ReactNode }): ReactNode => <>{children}</>;
Footer.displayName = 'Section.Footer';

// --- Main Section Component ---
export interface SectionProps extends VariantProps<typeof sectionVariants> {
  children: React.ReactNode;
  className?: string;
  borderless?: boolean; // borderless prop 다시 추가
}

export const Section = ({
  children,
  layout = 'main',
  variant = 'default',
  spacing = 'md',
  borderless = false, // 기본값은 false (테두리 있음)
  className,
}: SectionProps) => {
  let header: ReactNode = null;
  let content: ReactNode = null;
  let footer: ReactNode = null;

  Children.forEach(children, child => {
    if (isValidElement(child)) {
      const childProps: any = child.props;
      if (child.type === Header) header = childProps.children;
      if (child.type === Content) content = childProps.children;
      if (child.type === Footer) footer = childProps.children;
    }
  });

  if (!content && !header && !footer) {
    content = children;
  }

  const Wrapper: any = layout === 'main' ? 'section' : 'div';
  const baseClasses = sectionVariants({ layout, variant, spacing });

  if (variant === 'card') {
    return (
      <Wrapper className={cn(baseClasses, className)}>
        <Card
          className={cn(
            borderless ? 'border-0' : 'dark:border', // borderless가 true면 항상 테두리 없음
          )}
        >
          {header && (
            <CardHeader>
              <CardTitle>{header}</CardTitle>
            </CardHeader>
          )}
          {content && <CardContent>{content}</CardContent>}
          {footer && <CardFooter>{footer}</CardFooter>}
        </Card>
      </Wrapper>
    );
  }

  return (
    <Wrapper className={cn(baseClasses, className)}>
      {header && <header className="mb-4">{header}</header>}
      {content && <div>{content}</div>}
      {footer && <footer className="mt-4">{footer}</footer>}
    </Wrapper>
  );
};

// --- Attach Compound Components ---
Section.Header = Header;
Section.Content = Content;
Section.Footer = Footer;
