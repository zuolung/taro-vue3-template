import { getCurrentPages, showToast, redirectTo } from '@tarojs/taro'

const getCurPage = () => {
  const pages = getCurrentPages()
  const currentPage = pages[pages.length - 1] as Taro.Page
  return currentPage
}

const reloadPage = () => {
  const curPage = getCurPage()
  if (curPage) {
    redirectTo({
      url: `/${curPage['$taroPath']}`,
    })
  }
}

const Toast = (msg: string) => {
  return showToast({
    title: msg,
    icon: 'none',
    duration: 2500,
    mask: true,
  })
}

const isDev = process.env.NODE_ENV === 'development'

export { getCurPage, reloadPage, Toast, isDev }
