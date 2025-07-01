import { ReactNode, useState } from 'react';
import { useForm, UseFormProps, FieldValues } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { z } from '@mtr/utils';
import { Form } from '../../shadcn/components/ui/form';
import { Button } from '../buttons';

export interface BaseFormOptions<TResult = void> {
  onSuccess?: (data: TResult) => void | Promise<void>;
  onError?: (error: Error) => void;
  successMessage?: string;
  errorMessage?: string;
}

export interface BaseFormProps<TFormData extends FieldValues, TResult = void> {
  schema: z.ZodTypeAny;
  onSubmit: (data: TFormData) => Promise<TResult>;
  defaultValues?: UseFormProps<TFormData>['defaultValues'];
  children: (form: ReturnType<typeof useForm<TFormData>>) => ReactNode;
  submitText?: string;
  className?: string;
  options?: BaseFormOptions<TResult>;
}

export const BaseForm = <TFormData extends FieldValues, TResult = void>({
  schema,
  onSubmit,
  defaultValues,
  children,
  submitText = '제출',
  className = 'space-y-4',
  options = {},
}: BaseFormProps<TFormData, TResult>) => {
  const {
    onSuccess,
    onError,
    successMessage = '성공적으로 완료되었습니다.',
    errorMessage,
  } = options;

  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<TFormData>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const handleSubmit = async (data: TFormData) => {
    setIsLoading(true);

    try {
      const result = await onSubmit(data);

      if (successMessage) {
        toast.success(successMessage);
      }

      await onSuccess?.(result);
      return result;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown error');

      toast.error(errorMessage || error.message || '오류가 발생했습니다.');
      onError?.(error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={className}>
        {children(form)}
        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading ? '처리 중...' : submitText}
        </Button>
      </form>
    </Form>
  );
};
