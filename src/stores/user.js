import { defineStore } from 'pinia'
import { userApi } from '../api'

export const useUserStore = defineStore('user', {
  state: () => ({
    token: localStorage.getItem('token') || '',
    userInfo: JSON.parse(localStorage.getItem('userInfo') || 'null')
  }),
  getters: {
    isLoggedIn: (state) => !!state.token
  },
  actions: {
    async login(loginData) {
      try {
        const res = await userApi.login(loginData)
        if (res.code === '200' && res.data) {
          this.token = res.data.token || ''
          this.userInfo = res.data.user || {}
          localStorage.setItem('token', this.token)
          localStorage.setItem('userInfo', JSON.stringify(this.userInfo))
          return true
        }
        return false
      } catch (error) {
        console.error('登录失败:', error)
        return false
      }
    },
    logout() {
      this.token = ''
      this.userInfo = null
      localStorage.removeItem('token')
      localStorage.removeItem('userInfo')
    }
  }
})

