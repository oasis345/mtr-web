export type NotificationType = 'success' | 'error' | 'info' | 'warning';
export type Theme = 'light' | 'dark';

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

export interface UiService {
  theme: Theme;
  notify: (options: NotificationOptions) => void;
}
