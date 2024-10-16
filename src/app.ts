import { createApp } from 'vue'
import { onError, onUnhandledRejection } from '@tarojs/taro'
import { PiniaInstance, useMainStore } from './store/index'
import '@nutui/nutui-taro/dist/style.css'
import './iconfont/iconfont.css'
import './app.scss'

const App = createApp({
  onShow() {},
  // 入口组件不需要实现 render 方法，即使实现了也会被 taro 所覆盖
})
App.use(PiniaInstance)

// 内部全局错误页面状态处理， 异常不会trace已经处理
// 开发中的部分错误会阻塞vue的渲染，导致pageErrorUI无法展开
const errorWork = (error) => {
  const { setPageErrorInfo } = useMainStore()
  setPageErrorInfo({
    errorCode: -999,
    errorMessage: error,
    hasError: true,
  })
}
onUnhandledRejection(errorWork)
onError(errorWork)

export default App
