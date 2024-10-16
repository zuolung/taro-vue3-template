import { computed, defineComponent, reactive, onBeforeMount } from 'vue'
import { View, Image, Input, InputProps } from '@tarojs/components'
import logo from './assets/login-logo.png'
import bg from './assets/login_bg.png'
import formBg1 from './assets/login_m_content_bg.png'
import formBg2 from './assets/login_s_content_bg.png'
import { Button } from '@nutui/nutui-taro'
import { Container } from '../../components/index'
import { Toast, isDev } from '@/utils/utils'
import { login } from '@tarojs/taro'
import { sha256 } from 'js-sha256'
import { apiLogin } from './api'
import { useCatcher } from '@/hooks'
import { reLaunch } from '@tarojs/taro'
import './index.scss'
import cache from '@/cache'

const defaultForm = {
  mobleOrLoginName: isDev ? 'admin' : '',
  pwd: isDev ? '4000901656@e6' : '',
}

export default defineComponent({
  name: 'Index',
  setup() {
    const state = reactive({
      tabActive: 1,
      passwordType: 'password' as InputProps['type'],
    })

    const form = reactive(defaultForm)

    const isValidInput = computed(() => {
      return form.mobleOrLoginName && form.pwd
    })

    onBeforeMount(() => {
      cache.setUserInfo({})
    })

    const accountLogin = useCatcher(async () => {
      if (!form.mobleOrLoginName) {
        return Toast('请输入手机号/用户名')
      }
      if (!form.pwd) {
        return Toast('请输入密码')
      }
      const miniLoginRes = await login()

      const params = {
        userCode: form.mobleOrLoginName,
        userPassword: sha256(form.pwd),
        terminalType: 4,
        loginType: 0,
        code: miniLoginRes.code,
        verificationCode: '',
        encryptedData: '',
        iv: '',
      }
      const res = await apiLogin(params)
      if (res?.code === 1) {
        cache.setUserInfo(res.result)
        reLaunch({
          url: '/pages/index/index',
        })
      }
    })

    return () => {
      return (
        <Container conatinerClass="pages-login-index">
          <Image class="bg" src={bg}></Image>
          <View class="content">
            <Image class="logo" src={logo}></Image>
            <View
              class="form-box"
              style={{
                backgroundImage: `url("${
                  state.tabActive === 1 ? formBg1 : formBg2
                }")`,
              }}
            >
              <View class="tabs">
                <View
                  onClick={() => {
                    state.tabActive = 1
                  }}
                  class={`tab ${state.tabActive === 1 ? 'active' : ''}`}
                >
                  管理端登陆
                  <View class="line"></View>
                </View>
                <View
                  onClick={() => {
                    state.tabActive = 2
                  }}
                  class={`tab ${state.tabActive === 2 ? 'active' : ''}`}
                >
                  扫码登陆
                  <View class="line"></View>
                </View>
              </View>

              {state.tabActive === 1 && (
                <View class="form form1">
                  <View class="item">
                    <Input
                      value={form.mobleOrLoginName}
                      onInput={(e) => (form.mobleOrLoginName = e.detail.value)}
                      placeholder="账号"
                    ></Input>
                  </View>

                  <View class="item">
                    <Input
                      onInput={(e) => (form.pwd = e.detail.value)}
                      value={form.pwd}
                      placeholder="密码"
                      maxlength={15}
                      type={state.passwordType}
                    ></Input>
                  </View>

                  <Button
                    onClick={accountLogin}
                    disabled={!isValidInput}
                    block
                    type="primary"
                  >
                    登陆
                  </Button>
                </View>
              )}
            </View>
          </View>
        </Container>
      )
    }
  },
})

definePageConfig({
  navigationStyle: 'custom',
  navigationBarTextStyle: 'white',
})
