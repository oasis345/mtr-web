import { serviceFactory } from '@mtr/services';
import { clientApi, serverApi } from '@/api';

const api = typeof window !== 'undefined' ? clientApi : serverApi;
export const services = serviceFactory(api);
