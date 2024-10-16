import { createRequest } from '@/utils/request'

export const apiLogin = createRequest<any, any>({
  url: '/loginapp/applet/login',
  method: 'POST',
  useLoading: true,
})
