import { cva } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { ThemeToggle } from '../../components/components/ThemeToggle';
import Link from 'next/link';

const headerVariants = cva('flex items-center w-full h-16 px-5');

export type AppHeaderProps = {
  logo: React.ReactNode;
  nav: React.ReactNode;
  className?: string;
};

export const AppHeader = ({ logo, nav, className }: AppHeaderProps) => {
  return (
    <div className={cn(headerVariants(), className)}>
      <Link href="/">{logo}</Link>
      <nav>{nav}</nav>
      <ThemeToggle />
    </div>
  );
};
