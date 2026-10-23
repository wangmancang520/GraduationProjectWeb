import axios from 'axios'
import router from '@/router'
import ElementUI from 'element-ui'
import { readUser } from './session'
import { appointmentParams } from './appointment'

export const apiBaseURL = import.meta.env.VITE_API_BASE_URL || '/api'
const request = axios.create({ baseURL: apiBaseURL, timeout: 10000 })

request.interceptors.request.use(config => {
  if (/\/appointment\/(new|edit)$/.test(config.url) && config.params)
    config.params = appointmentParams(config.params)
  const user = readUser()
  if (user) config.headers.token = user.token
  return config
})

function expireSession(message) {
  localStorage.removeItem('user')
  ElementUI.Message.error(message || '登录已失效，请重新登录')
  if (router.currentRoute.path !== '/login') router.replace('/login').catch(() => {})
}

request.interceptors.response.use(response => {
  const data = response.data
  if (data && String(data.code) === '401') expireSession(data.msg)
  return data
}, error => {
  if (error.response && error.response.status === 401) expireSession()
  else ElementUI.Message.error(error.response ? '请求失败，请稍后重试' : '无法连接服务器，请检查网络或后端服务')
  return Promise.reject(error)
})
export default request
