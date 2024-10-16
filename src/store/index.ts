import { defineStore, createPinia } from 'pinia'
import { reactive } from 'vue'

type ErrorInfo = {
  hasError: boolean
  errorMessage: any
  errorCode?: number
}
/**
 * 接口URL/关键字和loading的对应关系
 */
interface LoadingInfo {
  [key: string]: boolean
}

export const useMainStore = defineStore('main', {
  state: () => ({
    loadingInfo: {} as LoadingInfo,
    loading: false,
    pageErrorInfo: reactive<ErrorInfo>({
      hasError: false,
      errorMessage: '',
      errorCode: undefined,
    }),
  }),
  actions: {
    clearLoading() {
      this.loadingInfo = {}
    },
    setLoading(l: LoadingInfo) {
      this.loadingInfo = {
        ...this.loadingInfo,
        ...l,
      }
    },
    setPageErrorInfo(errorInfo: ErrorInfo) {
      this.pageErrorInfo = errorInfo
    },
  },
})

export const PiniaInstance = createPinia()
