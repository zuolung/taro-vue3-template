import {
	getCurrentPages,
	getApp,
	showToast,
	switchTab,
	redirectTo,
	getAccountInfoSync,
} from '@tarojs/taro'

const getCurPage = () => {
	const pages = getCurrentPages()
	const currentPage = pages[pages.length - 1] as Taro.Page
	return currentPage
}

const reloadPage = () => {
	const curPage = getCurPage()

	const tabBar = getApp()['config'].tabBar

	if (curPage) {
		if (tabBar.list.some((el) => el.pagePath === curPage['route'])) {
			switchTab({
				url: `/${curPage['$taroPath']}`,
			})
		} else {
			redirectTo({
				url: `/${curPage['$taroPath']}`,
			})
		}
	}
}

const Toast = (msg: string, complete?: () => void) => {
	return new Promise((resolve) => {
		setTimeout(async () => {
			const res = await showToast({
				title: msg,
				icon: 'none',
				duration: 2000,
				mask: true,
				complete: complete,
			})

			resolve(res)
		}, 66)
	})
}

let minEnvVersion = ''
let isDev
let isReal

if (process.env.TARO_ENV === 'h5') {
	isDev = process.env.NODE_ENV === 'development'
	isReal = window.location.href.includes('ams.')
} else {
	// 小程序手动发布
	const accountIno = getAccountInfoSync()
	minEnvVersion = accountIno.miniProgram.envVersion
	isDev = minEnvVersion === 'develop'
	isReal = minEnvVersion === 'release'
}

export { getCurPage, reloadPage, Toast, isDev, isReal }
