import { toast as sonnerToast } from 'sonner';
import { Toaster as SonnerToaster } from '../../shadcn/components/ui/sonner';

export const ToastProvider = SonnerToaster;

// sonner 라이브러리에서 직접 메시지와 옵션 타입을 추론합니다.
// 이렇게 하면 타입 충돌 문제를 근본적으로 해결할 수 있습니다.
type SonnerMessage = Parameters<typeof sonnerToast.success>[0];
type SonnerOptions = Parameters<typeof sonnerToast.success>[1];

export const toast = {
  success: (message: SonnerMessage, options?: SonnerOptions) => {
    sonnerToast.success(message, options);
  },
  error: (message: SonnerMessage, options?: SonnerOptions) => {
    sonnerToast.error(message, options);
  },
  info: (message: SonnerMessage, options?: SonnerOptions) => {
    sonnerToast.info(message, options);
  },
};

export type ToastType = keyof typeof toast;

export type ServiceToastOptions = {
  type: ToastType;
  description?: string;
  duration?: number;
  options?: object;
};
