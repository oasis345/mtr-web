// in @mtr/services/src/ui/type.ts

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export type NotificationOptions = {
  message: string;
  type?: NotificationType;
  duration?: number;
};

export type NavigationOptions = {
  push: (path: string) => void;
  replace: (path: string) => void;
  back: () => void;
};

export type UiService = {
  notify: (options: NotificationOptions) => void;
  navigate: NavigationOptions;
};
