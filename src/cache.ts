import { getStorageSync, setStorageSync } from '@tarojs/taro'

export type UserInfo = {
  openId?: string
  secret?: string
  userId?: number | string
  userCode?: string
}

export type Location = {
  latitude: string
  longitude: string
}

function setStorage<T>(key: string, value: T): void {
  setStorageSync(key.toString(), JSON.stringify(value))
}

function getStorage<T>(key: string): T | null {
  const item = getStorageSync(key.toString())
  try {
    return item ? JSON.parse(item) : null
  } catch (error) {
    throw new Error(`storage ${key.toString()} json parse error`)
  }
}

const cache = {
  setUserInfo: (value: UserInfo) => setStorage<UserInfo>('userInfo', value),
  getUserInfo: () => getStorage<UserInfo>('userInfo'),
  setLocation: (value: Location) => setStorage<Location>('location', value),
  getLocation: () => getStorage<Location>('location'),
}

export default cache
