import { View } from '@tarojs/components'
import { useMainStore } from '../../store/index'
import { computed, defineComponent, ref } from 'vue'
import { Button, Watermark } from '@nutui/nutui-taro'
import { reloadPage } from '@/utils/utils'
import { useDidHide, useDidShow } from '@tarojs/taro'
import './index.scss'
import cache, { UserInfo } from '@/cache'

// TODO 定义头部导航栏NavBar和底部TabBar栏
export default defineComponent({
  name: 'container',
  props: {
    conatinerClass: String,
    loading: Boolean,
  },
  setup(props, ots) {
    const { conatinerClass = '', loading = false } = props
    const { setPageErrorInfo, clearLoading } = useMainStore()
    const { slots } = ots
    const userInfo = ref<UserInfo | null>()

    const handleReload = () => {
      reloadPage()
    }

    useDidShow(() => {
      userInfo.value = cache.getUserInfo()
      clearLoading()
      setPageErrorInfo({
        hasError: false,
        errorCode: undefined,
        errorMessage: '',
      })
    })

    useDidHide(() => {
      clearLoading()
      setPageErrorInfo({
        hasError: false,
        errorCode: undefined,
        errorMessage: '',
      })
    })

    return () => {
      const { pageErrorInfo, loadingInfo } = useMainStore()
      const lastLoading = computed(() => {
        const keys = Object.keys(loadingInfo)
        let l = false
        if (keys?.length) {
          l = keys.map((it) => loadingInfo[it]).some((it) => !!it)
        }

        return l || loading
      })

      let error = ''
      let errorMessage =
        pageErrorInfo.errorMessage?.reason || pageErrorInfo.errorMessage

      if (errorMessage) {
        if (typeof errorMessage === 'string') {
          error = errorMessage
        } else if (errorMessage?.toString()?.includes?.('[object') !== true) {
          error = errorMessage?.toString()
        } else if (typeof errorMessage === 'object') {
          error = JSON.stringify(errorMessage)
        }
      }

      return (
        <View class={`common-components-container ${conatinerClass}`}>
          {pageErrorInfo.hasError && (
            <View class="error-info">
              <View
                style={{ fontSize: '200px' }}
                class="jmc-icon jmc-icon-Nodata-pana_fuzhi"
              ></View>
              <View class="error-title">很抱歉，页面出现错误了</View>
              <View class="error-detail">
                {error?.slice(0, 200)} {error?.length > 200 ? '...' : ''}
              </View>
              <Button onClick={handleReload}>重新加载</Button>
            </View>
          )}
          {!pageErrorInfo.hasError && (
            <View class="page-main">
              {lastLoading.value && (
                <View>
                  <View class="loading-mask"></View>
                  <View class="jmc-icon jmc-icon-loading"></View>
                </View>
              )}
              {slots['default']?.()}
            </View>
          )}

          {userInfo.value?.userCode && (
            <Watermark
              content={`JMC-${userInfo.value?.userCode}-${userInfo.value?.userId}`}
              imageHeight={40}
              imageWidth={23}
              zIndex={999}
              fontColor="#333"
              style="opacity: 0.1"
            ></Watermark>
          )}
        </View>
      )
    }
  },
})
