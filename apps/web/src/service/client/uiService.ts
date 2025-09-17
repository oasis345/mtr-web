import { type ToastOptions, Toast } from '@mtr/ui/client';
import type { UiService, NotificationOptions, NavigationOptions } from '@mtr/services';

type WebNotificationOptions = NotificationOptions & {
  props?: ToastOptions;
};

export const createUiService = (router: NavigationOptions): UiService => {
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

  const navigate: NavigationOptions = {
    push: (path: string) => {
      router.push(path);
    },
    replace: (path: string) => {
      router.replace(path);
    },
    back: () => {
      router.back();
    },
  };

  return { notify, navigate };
};
