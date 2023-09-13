import { ref } from 'vue'
import { defineStore } from 'pinia'

// 使用setup模式定义
export const userLoginStore = defineStore(
  'login_store',
  () => {
    const userInfo = ref({})

    const loginFn = (info) => {
      setUserAuthorization(info?.authorization)
      setUserInfo(info)
    }

    const logout = () => {
      setUserAuthorization('')
      setUserInfo({})
    }

    const setUserInfo = (info) => {
      userInfo.value = info
    }

    return {
      userInfo,
      loginFn,
      logout,
      setUserInfo
    }
  },
  {
    persist: {
      enabled: true,
      strategies: [
        {
          storage: localStorage
        }
      ]
    }
  }
)
