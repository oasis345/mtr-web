import { ReactNode } from 'react';
import { type VariantProps } from 'class-variance-authority';
import { cn } from '../../../lib/utils';
import { Heading } from '../../typography/Heading';
import { cva } from 'class-variance-authority';

export interface SectionProps extends VariantProps<typeof sectionVariants> {
  title?: string;
  children: ReactNode;
  className?: string;
  // 제목 관련 props
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  titleSize?: VariantProps<typeof titleVariants>['size'];
  titleColor?: VariantProps<typeof titleVariants>['color'];
  // 콘텐츠 관련 props
  contentSize?: VariantProps<typeof contentVariants>['size'];
  contentColor?: VariantProps<typeof contentVariants>['color'];
}

export const sectionVariants = cva('', {
  variants: {
    // 레이아웃 타입
    layout: {
      main: '', // 메인 섹션
      sidebar: '', // 사이드바 섹션
    },
    // 간격
    spacing: {
      compact: 'mb-3',
      normal: 'mb-4',
      relaxed: 'mb-6',
      section: 'mb-6', // 섹션 전용
    },
    // 패딩 (메인 섹션만)
    padding: {
      none: '',
      sm: 'p-2',
      md: 'p-4',
      lg: 'p-6',
    },
    // 배경 (메인 섹션만)
    background: {
      none: '',
      white: 'bg-white',
      gray: 'bg-gray-50',
      card: 'bg-white shadow-sm border rounded-lg',
    },
    // 구분선 (사이드바만)
    divider: {
      none: '',
      border: 'pb-4 border-b border-gray-200 last:border-b-0',
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
    spacing: 'normal',
    padding: 'none',
    background: 'none',
    divider: 'none',
  },
});

// 제목 스타일
export const titleVariants = cva('font-medium mb-3', {
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
      default: 'text-gray-800',
      muted: 'text-gray-600',
      primary: 'text-blue-600',
    },
  },
  defaultVariants: {
    size: 'lg',
    color: 'default',
  },
});

// 콘텐츠 스타일
export const contentVariants = cva('', {
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

export const Section = ({
  title,
  children,
  layout = 'main',
  spacing = 'normal',
  padding = 'none',
  background = 'none',
  divider = 'none',
  titleAs = 'h2',
  titleSize = 'lg',
  titleColor = 'default',
  contentSize = 'md',
  contentColor = 'muted',
  className,
}: SectionProps) => {
  const Component = layout === 'main' ? 'section' : 'div';

  return (
    <Component
      className={cn(sectionVariants({ layout, spacing, padding, background, divider }), className)}
    >
      {title && (
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
      )}
      <div className={contentVariants({ size: contentSize, color: contentColor })}>{children}</div>
    </Component>
  );
};
