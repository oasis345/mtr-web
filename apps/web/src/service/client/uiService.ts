import { type NotificationOptions, UiService } from '@mtr/ui';
import { Toast, type ToastOptions } from '@mtr/ui/client';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
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
