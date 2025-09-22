import { type ToastOptions, Toast } from '@mtr/ui/client';
import { UiService, NotificationOptions  } from '@mtr/ui';

type WebNotificationOptions = NotificationOptions & {
  props?: ToastOptions;
};

export const createUiService = (): UiService => {
  const theme = 'dark';
  const notify = (options: WebNotificationOptions) => {
    const { message, type = 'info', duration, props } = options;
    const toastMethods = {
      success: Toast.success,
      error: Toast.error,
      info: Toast.info,
      warning: Toast.warning,
    } as const;
    const method = toastMethods[type];

    method(message, { duration, ...props });
  };


  return { notify, theme };
};
