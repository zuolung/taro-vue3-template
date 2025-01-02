import { request as TRequest, getAccountInfoSync, reLaunch } from '@tarojs/taro'
import { Toast, getCurPage, isDev } from '../utils/utils'
import { useMainStore } from '../store/index'
import { EMlf } from '@antmjs/trace'
import { monitor } from '@/trace'
import cache, { UserInfo } from '@/cache'
import { sha256 } from 'js-sha256'

function sendMonitor(option: any, res: any) {
	const params = {
		d1: option.url,
		d2: JSON.stringify(option),
		d3: res.status,
		d4: res.code,
		d5: JSON.stringify(res),
	}
	if (isDev) {
		console.error('development:requestCatch', option, res)
	}
	monitor(EMlf.api, params)
}

export interface RequestType<T> {
	url: string
	method?: keyof Taro.request.Method
	header?: TaroGeneral.IAnyObject
	data?: T
	/** 错误信息自行处理，默认false，request内部toast/错误页面 */
	handleBiz?: boolean
	/** 错误反馈方式 */
	errorShow?: 'toast' | 'errorPage'
	/** 是否全局loaing */
	useLoading?: boolean
}

export interface ResponseType<T> {
	code: number
	message?: string
	data?: T
	result?: T
}
/**
 * 请求接口前缀,
 * runWatch根据小程序环境自动判断走uat/real
 * runBuild根据小程序环境自动判断走uat/real
 * runDev根据process.env.API_ENV获取域名
 */
let baseURL = ''
const URLS = {
	uat: 'https://amsuat.jmclexing.com',
	real: 'https://ams.jmclexing.com',
	dev: 'https://amsdev.jmclexing.com',
}
let requestEnv: 'uat' | 'real' | 'dev' = 'uat'
if (process.env.TARO_ENV === 'h5') {
	requestEnv = process.env.API_ENV || 'uat'
} else {
	const accountIno = getAccountInfoSync()
	const minEnvVersion = accountIno.miniProgram.envVersion
	if (['develop', 'trial'].includes(minEnvVersion)) {
		requestEnv = process.env.API_ENV || 'uat'
	} else {
		requestEnv = process.env.API_ENV || 'real'
	}
}
baseURL = process.env.API_URL || URLS[requestEnv]

// http状态码判断
function handleHttpCode(res, setPageErrorInfo) {
	switch (res.statusCode) {
		case 200:
			return res.data
		case 204:
			return res.data
		case 400:
			if (!hasRequestErrorBefore) {
				setPageErrorInfo({
					errorCode: res.statusCode,
					hasError: true,
					errorMessage: '请求参数/方法不正确',
				})
			}
			break
		case 404:
			if (!hasRequestErrorBefore) {
				if (!hasRequestErrorBefore) {
					setPageErrorInfo({
						errorCode: res.statusCode,
						hasError: true,
						errorMessage: '请求路径不存在',
					})
				}
			}
			break
		default:
			if (!hasRequestErrorBefore) {
				if (!hasRequestErrorBefore) {
					if (!hasRequestErrorBefore) {
						setPageErrorInfo({
							errorCode: res.statusCode,
							hasError: true,
							errorMessage: '服务器运行错误',
						})
					}
				}
			}
	}
}

function goLogin() {
	const curPage = getCurPage()
	if (!curPage['$taroPath'].includes('pages/login/index')) {
		Toast('登陆超时', () => {
			reLaunch({
				url: '/pages/login/index',
			})
		})
	}
}

// 业务状态码判断
function handleBizCode(result: ResponseType<any>) {
	switch (result.code) {
		// 业务响应成功
		case 1:
			return true
		case 401:
			goLogin()
			// 登陆超时
			return 401
		case 303:
			goLogin()
			// 登陆超时
			return 303
		default:
			// 业务响应失败
			return false
	}
}

function sign(obj: any, secret) {
	let str = ''
	let arr: any[] = []
	for (let x in obj) {
		arr.push(x + obj[x])
	}
	arr.sort()
	str += secret
	for (let item in arr) {
		str = str + arr[item]
	}
	str += secret
	return sha256(str).toUpperCase()
}

// 创建请求头，支持账号登陆和授权登陆需要存储的信息
function createHeader() {
	const timestamp = new Date().getTime()
	const userInfo = cache.getUserInfo() || ({} as UserInfo)

	const signData = {
		token: userInfo.openId,
		timestamp: timestamp,
	}
	const header = {
		'Accept-Language': 'zh-CN',
		openId: userInfo.openId || '',
		secret: userInfo.secret || '',
		sign: sign(signData, userInfo.secret || ''),
		timestamp: timestamp,
		'Content-Type': 'application/json; charset=utf-8',
		platform: 1,
	}
	return header
}

let hasRequestErrorBefore = false

function setHasRequestErrorBefore() {
	hasRequestErrorBefore = true
	setTimeout(() => {
		hasRequestErrorBefore = false
	}, 2 * 1000)
}

function request<T = any, U = any>(requestParams: RequestType<T>): Promise<ResponseType<U>> {
	const {
		url,
		method = 'GET',
		header,
		data,
		handleBiz = false,
		errorShow = 'toast',
		useLoading = false,
	} = requestParams

	const { setPageErrorInfo, setLoading } = useMainStore()

	const setPageErrorInfo_ = (errInfo) => {
		if (!hasRequestErrorBefore) {
			setHasRequestErrorBefore()
			setPageErrorInfo(errInfo)
		}
	}

	return new Promise((resolve, reject) => {
		if (useLoading) {
			setLoading({
				[url]: true,
			})
		}
		TRequest({
			url: baseURL + url,
			method,
			header: {
				...createHeader(),
				...header,
			},
			data,
		})
			.then((res) => {
				const httpRes = handleHttpCode(res, setPageErrorInfo_)

				if (httpRes) {
					const success = handleBizCode(httpRes)

					if (success || handleBiz) {
						resolve(httpRes)
					} else if (success === false) {
						sendMonitor(requestParams, res)
						if (errorShow === 'toast') {
							if (!hasRequestErrorBefore) Toast(httpRes.message || '服务异常')
							setHasRequestErrorBefore()
						} else {
							setPageErrorInfo_({
								errorCode: httpRes.code || 500,
								hasError: true,
								errorMessage: httpRes.message || '服务异常',
							})
						}
					}
				} else {
					sendMonitor(requestParams, res)
				}
			})
			.catch((err) => {
				reject(err)
			})
			.finally(() => {
				if (useLoading) {
					setLoading({
						[url]: false,
					})
				}
			})
	})
}

function createRequest<REQ extends Record<string, any>, RES extends Record<string, any>>(
	params: RequestType<REQ>
) {
	return (data: REQ): Promise<ResponseType<RES>> => {
		return request<REQ, RES>({
			...params,
			data,
		})
	}
}

export { createRequest, request, createHeader, baseURL }
