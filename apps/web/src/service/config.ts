export const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
export const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
export const CLIENT_BASE_URL = process.env.NEXT_PUBLIC_CLIENT_BASE_URL;
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL;
export const isServer = typeof window === 'undefined';
