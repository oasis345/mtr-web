export const isServer = typeof window === 'undefined';
export const CLIENT_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_BASE_URL || '';
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '';
