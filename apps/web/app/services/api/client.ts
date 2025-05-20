// apps/web/api/user/index.ts
import { api } from '@isnow/services';

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  // ... 기본 설정
});

export const getUser = async (id: string) => {
  const { data } = await api.get(`/users/${id}`);
  return data;
};
