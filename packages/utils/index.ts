// Re-export commonly used lodash functions
export { debounce, throttle, cloneDeep, merge, pick, omit } from 'lodash';

// Utility functions
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
};

export const formatDate = (date: Date | string, locale = 'en-US'): string => {
  return new Intl.DateTimeFormat(locale).format(new Date(date));
};

export const sleep = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};
