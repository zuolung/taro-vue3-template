import { createRequest } from '@/utils/request'

// demo api
export const getUserInfo = createRequest<{ userId: string }, { userName: string; age: number }>({
	url: 'xxxxxxx',
	useLoading: true, // 全局loading
	errorShow: 'errorPage', // 错误展示方式
})
