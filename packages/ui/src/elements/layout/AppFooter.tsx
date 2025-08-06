import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const footerVariants = cva('flex justify-center items-center w-full h-16 px-5');

export type AppFooterProps = {
  className?: string;
  children?: React.ReactNode;
};

export const AppFooter = ({ className, children = 'footer' }: AppFooterProps) => {
  return <div className={cn(footerVariants(), className)}>{children}</div>;
};
