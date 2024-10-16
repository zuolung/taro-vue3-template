import { useMainStore } from '@/store/index'
import { EMlf } from '@antmjs/trace'
import { useDidHide } from '@tarojs/taro'
import { monitor } from '@/trace'
import { watch } from 'vue'

/**
 * 捕获异步方法中的错误, 防止多层级异步方法无法捕获
 * @param {Function} method 要执行的方法
 * @returns {Function} 包含错误处理的执行方法
 */
export function useCatcher(method) {
  const { setPageErrorInfo } = useMainStore()
  const executeWithCatch = async () => {
    try {
      await method()
    } catch (error: any) {
      console.error(`useCatcher function error：`, error)
      setPageErrorInfo({
        errorCode: -999,
        errorMessage: error,
        hasError: true,
      })
      monitor(EMlf.js, {
        d1: 'useCatcher',
        d2: JSON.stringify(error || ''),
      })
    }
  }

  return executeWithCatch
}

/**
 * 创建一个防抖执行函数
 * @param watchValue 监听值
 * @fn 需要执行的函数
 * @param delay 防抖延迟时间（毫秒）
 */
export function useDebounceWatch(watchValue, fn, delay = 100) {
  let timeoutId: null | NodeJS.Timeout = null

  useDidHide(() => {
    if (timeoutId) clearTimeout(timeoutId)
  })

  watch(watchValue, () => {
    if (timeoutId) clearTimeout(timeoutId)
    timeoutId = setTimeout(() => {
      fn()
    }, delay)
  })
}

/**
 * 创建一个截流执行函数
 * @param watchValue 监听值
 * @fn 需要执行的函数
 * @param delay 防抖延迟时间（毫秒）
 */
export function useThrottleWatch(watchValue, fn, delay = 100) {
  let timeoutId: null | NodeJS.Timeout = null

  useDidHide(() => {
    if (timeoutId) clearTimeout(timeoutId)
  })

  watch(watchValue, () => {
    if (!timeoutId) fn()
    timeoutId = setTimeout(() => {
      timeoutId = null
    }, delay)
  })
}
