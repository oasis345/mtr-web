import { type ToastOptions, toast } from '@mtr/ui/client';
import { type NotificationOptions } from '@mtr/services';

type WebNotificationOptions = NotificationOptions & {
  props?: ToastOptions;
};

export const createUiService = () => {
  const notify = (options: WebNotificationOptions) => {
    const { message, type = 'info', duration, props } = options;
    const toastMethods = {
      success: toast.success,
      error: toast.error,
      info: toast.info,
      warning: toast.warning,
    } as const;
    const method = toastMethods[type];

    method(message, { duration, ...props });
  };

  return { notify };
};
