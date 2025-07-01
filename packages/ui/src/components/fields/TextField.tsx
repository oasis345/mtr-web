import { forwardRef } from 'react';
import { Input as ShadInput } from '../../shadcn/components/ui/input';
import { Label } from '../../shadcn/components/ui/label';
import { type TextFieldProps } from './types';

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  ({ children, ...props }, ref) => {
    const { name, label } = props;

    return (
      <>
        {label && <Label htmlFor={name}>{label}</Label>}
        <ShadInput ref={ref} {...props} id={name}>
          {children}
        </ShadInput>
      </>
    );
  },
);

TextField.displayName = 'TextField';
