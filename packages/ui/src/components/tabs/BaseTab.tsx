import { Tabs, TabsList, TabsTrigger, TabsContent } from '../../shadcn/components/ui/tabs';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

export type TabItem = {
  label: string;
  value: string;
  item?: React.ReactNode;
};

export interface BaseTabProps extends VariantProps<typeof tabVariants> {
  data: TabItem[];
  defaultValue: string;
  onValueChange: (value: string) => void;
  className?: string;
}

export const tabVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // 기본 스타일 - shadcn 호환
        default:
          'bg-transparent text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:font-semibold',

        // 카드 스타일 - shadcn 호환
        card: 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm border border-border',

        // 언더라인 스타일 - shadcn 호환
        underline:
          'bg-transparent text-muted-foreground hover:text-foreground data-[state=active]:text-foreground data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none border-b-2 border-transparent',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-8 px-3 py-1 text-xs',
        lg: 'h-12 px-6 py-3 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export const tabsListVariants = cva('inline-flex items-center justify-center', {
  variants: {
    variant: {
      default: 'bg-transparent gap-1',
      card: 'bg-muted rounded-lg p-1 gap-1',
      underline: 'bg-transparent border-b border-border',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export const BaseTab = ({
  data,
  defaultValue,
  onValueChange,
  variant = 'default',
  size = 'default',
  className,
}: BaseTabProps) => {
  return (
    <Tabs
      defaultValue={defaultValue}
      className={cn('w-full', className)}
      onValueChange={onValueChange}
    >
      <TabsList className={cn(tabsListVariants({ variant }))}>
        {data.map(item => (
          <TabsTrigger
            key={item.value}
            value={item.value}
            className={cn(tabVariants({ variant, size }))}
          >
            {item.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {data.map(item => {
        if (item.item) {
          return (
            <TabsContent key={item.value} value={item.value}>
              {item.item}
            </TabsContent>
          );
        }
      })}
    </Tabs>
  );
};
