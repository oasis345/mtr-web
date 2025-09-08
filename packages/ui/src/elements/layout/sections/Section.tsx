import { ReactNode } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';
import { Heading } from '../../typography/Heading';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '../../../shadcn/components/ui/card';
import { cva } from 'class-variance-authority';

export interface SectionProps extends VariantProps<typeof sectionVariants> {
  title?: string;
  children: ReactNode;
  footer?: ReactNode; // Card footer 추가
  className?: string;
  // 제목 관련 props
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  titleSize?: VariantProps<typeof titleVariants>['size'];
  titleColor?: VariantProps<typeof titleVariants>['color'];
  // 콘텐츠 관련 props
  contentSize?: VariantProps<typeof contentVariants>['size'];
  contentColor?: VariantProps<typeof contentVariants>['color'];
  // Card 관련 props
  cardHeaderClass?: string;
  cardContentClass?: string;
  cardFooterClass?: string;
}

export const sectionVariants = cva('', {
  variants: {
    // 레이아웃 타입
    layout: {
      main: '', // 메인 섹션
      sidebar: '', // 사이드바 섹션
    },
    // 스타일 variant
    variant: {
      default: '', // 기본 스타일
      card: '', // Card 스타일 (shadcn Card 컴포넌트 활용)
    },
    // 간격
    spacing: {
      compact: 'mb-3',
      normal: 'mb-4',
      relaxed: 'mb-6',
      section: 'mb-6', // 섹션 전용
    },
    // 패딩 (variant="default"일 때만 적용)
    padding: {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    },
    // 배경 (variant="default"일 때만 적용)
    background: {
      none: '',
      muted: 'bg-muted/50', // shadcn muted 색상
      accent: 'bg-accent', // shadcn accent 색상
    },
    // 구분선 (사이드바만)
    divider: {
      none: '',
      border: 'pb-4 border-b border-border last:border-b-0',
      shadow: 'pb-4 shadow-sm last:shadow-none',
    },
  },
  compoundVariants: [
    // 메인 섹션: 기본 spacing은 section
    {
      layout: 'main',
      spacing: 'normal',
      className: 'mb-6',
    },
    // 사이드바: 기본 spacing은 normal
    {
      layout: 'sidebar',
      spacing: 'normal',
      className: 'mb-4',
    },
  ],
  defaultVariants: {
    layout: 'main',
    variant: 'default',
    spacing: 'normal',
    padding: 'none',
    background: 'none',
    divider: 'none',
  },
});

// 제목 스타일 (shadcn 호환)
export const titleVariants = cva('font-medium', {
  variants: {
    size: {
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      primary: 'text-primary',
    },
  },
  defaultVariants: {
    size: 'lg',
    color: 'default',
  },
});

// 콘텐츠 스타일 (shadcn 호환)
export const contentVariants = cva('', {
  variants: {
    size: {
      sm: 'text-xs',
      md: 'text-sm',
      lg: 'text-base',
    },
    color: {
      default: 'text-foreground',
      muted: 'text-muted-foreground',
      light: 'text-muted-foreground/80',
    },
  },
  defaultVariants: {
    size: 'md',
    color: 'muted',
  },
});

export const Section = ({
  title,
  children,
  footer,
  layout = 'main',
  variant = 'default',
  spacing = 'normal',
  padding = 'none',
  background = 'none',
  divider = 'none',
  titleAs = 'h2',
  titleSize = 'lg',
  titleColor = 'default',
  contentSize = 'md',
  contentColor = 'muted',
  cardHeaderClass,
  cardContentClass,
  cardFooterClass,
  className,
}: SectionProps) => {
  const Component = layout === 'main' ? 'section' : 'div';

  // 제목 렌더링 (Card가 아닌 경우)
  const renderTitle = () => {
    if (!title) return null;

    return (
      <Heading
        as={titleAs}
        size={titleSize}
        variant={
          titleColor === 'primary' ? 'primary' : titleColor === 'muted' ? 'muted' : 'default'
        }
        className="mb-4"
      >
        {title}
      </Heading>
    );
  };

  // Card Title 렌더링 (Card용)
  const renderCardTitle = () => {
    if (!title) return null;

    return (
      <CardTitle className={cn(titleVariants({ size: titleSize, color: titleColor }))}>
        {title}
      </CardTitle>
    );
  };

  // 콘텐츠 렌더링
  const renderContent = () => (
    <div className={contentVariants({ size: contentSize, color: contentColor })}>{children}</div>
  );

  // 기본 variant
  if (variant === 'default') {
    const baseClasses = sectionVariants({
      layout,
      spacing,
      padding,
      background,
      divider,
    });

    return (
      <Component className={cn(baseClasses, className)}>
        {renderTitle()}
        {renderContent()}
      </Component>
    );
  }

  // Card variant (완전한 Card 구조)
  if (variant === 'card') {
    const cardClasses = cn(sectionVariants({ layout, spacing, divider }), className);

    return (
      <Component className={cardClasses}>
        <Card>
          {/* CardHeader: 제목이 있을 때만 렌더링 */}
          {title && <CardHeader className={cardHeaderClass}>{renderCardTitle()}</CardHeader>}

          {/* CardContent: 항상 렌더링 */}
          <CardContent className={cardContentClass}>{renderContent()}</CardContent>

          {/* CardFooter: footer가 있을 때만 렌더링 */}
          {footer && <CardFooter className={cardFooterClass}>{footer}</CardFooter>}
        </Card>
      </Component>
    );
  }

  return null;
};
