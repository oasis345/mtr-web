// in @mtr/services/src/ui/type.ts

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export type NotificationOptions = {
  message: string;
  type?: NotificationType;
  duration?: number;
};

export type UiService = {
  notify: (options: NotificationOptions) => void;
};
