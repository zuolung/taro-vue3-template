/// <reference types="@tarojs/taro" />

/// <reference types="@tarojs/components/vue3" />

/// <reference types="@nutui/nutui-taro" />

declare module '*.png'
declare module '*.gif'
declare module '*.jpg'
declare module '*.jpeg'
declare module '*.svg'
declare module '*.css'
declare module '*.less'
declare module '*.scss'
declare module '*.sass'
declare module '*.styl'
declare let wx: any
declare let my: any
declare let ks: any
declare let tt: any

declare namespace NodeJS {
	interface ProcessEnv {
		API_URL: string
		NODE_ENV: 'production' | 'development'
		TARO_ENV: 'weapp' | 'alipay' | 'h5' | 'tt' | 'kwai'
		API_ENV: 'real' | 'uat' | 'dev'
		DEPLOY_VERSION: string
	}
}
