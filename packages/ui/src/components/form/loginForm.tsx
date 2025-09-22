'use client';
import { loginSchema, type LoginFormFields } from '@mtr/auth-core';
import { TextField } from '../fields';
import { BaseForm } from './BaseForm';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '../../shadcn/components/ui/form';
import { OauthButton } from '../buttons/oauth/OauthButton';

export interface LoginFormProps {
  onSubmit?: (data: LoginFormFields) => Promise<void>;
  onSuccess?: () => void;
  googleLoginUrl?: string;
}

export const LoginForm = ({ onSubmit, onSuccess, googleLoginUrl }: LoginFormProps) => {
  return (
    <>
      <BaseForm
        schema={loginSchema}
        onSubmit={onSubmit}
        defaultValues={{ id: '', password: '' }}
        submitText="로그인"
        options={{
          successMessage: '로그인되었습니다.',
          onSuccess,
        }}
      >
        {form => (
          <>
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>아이디</FormLabel>
                  <FormControl>
                    <TextField placeholder="아이디를 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>비밀번호</FormLabel>
                  <FormControl>
                    <TextField type="password" placeholder="비밀번호를 입력하세요" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
      </BaseForm>
      <div className="space-y-2 h-2" />
      <OauthButton label="Google Login" oauthUrl={googleLoginUrl} />
    </>
  );
};
