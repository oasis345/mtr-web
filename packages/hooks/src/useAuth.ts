import { useCallback } from 'react';
import { LoginFormFields } from '@mtr/services';
import { useAppServices } from '@mtr/store';

export const useAuth = () => {
  const { authService } = useAppServices();
  const signin = useCallback(
    async (data: LoginFormFields): Promise<void> => {
      await authService.signin({
        email: data.id,
        password: data.password,
      });
    },
    [authService],
  );

  return {
    signin,
  };
};
