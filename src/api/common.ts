import { createRequest } from '@/utils/request'

export const getUserInfo = createRequest<
  { userId: string },
  { userName: string; age: number }
>({
  url: 'xxxxxxx',
})
