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
        // 기본 스타일 (이미지와 유사)
        default:
          'bg-transparent text-gray-500 hover:text-gray-700 data-[state=active]:text-black data-[state=active]:font-semibold',

        // 카드 스타일
        card: 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800 data-[state=active]:bg-white data-[state=active]:text-black data-[state=active]:shadow-sm border border-gray-200',

        // 언더라인 스타일
        underline:
          'bg-transparent text-gray-500 hover:text-gray-700 data-[state=active]:text-black data-[state=active]:border-b-2 data-[state=active]:border-pink-500 rounded-none border-b-2 border-transparent',
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
      card: 'bg-gray-100 rounded-lg p-1 gap-1',
      underline: 'bg-transparent border-b border-gray-200',
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
