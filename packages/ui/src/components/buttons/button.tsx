import { forwardRef } from 'react';
import { type ButtonProps, Button as ShadButton } from '../../shadcn/components/ui/button';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ children, ...props }, ref) => {
  return (
    <ShadButton ref={ref} {...props}>
      {children}
    </ShadButton>
  );
});

Button.displayName = 'Button';
