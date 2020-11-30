import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import { Loading } from 'element-ui';

const loading = {
  LoadingService: null,
  open() {
    if (this.LoadingService == null) {
      this.LoadingService = Loading.service({
        target: '.rightBox',
        text: '正在加载中请稍后·······',
        background: 'rgba(0,0,0,0.5)',
      })
    }
  },
  close() {
    if (this.LoadingService != null) {
      this.LoadingService.close()
    }
    this.LoadingService = null
  },
}

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 10000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent
    loading.open()
    if (store.getters.token) {
      config.headers['X-Token'] = getToken()
    }
    return config
  },
  error => {
    loading.close()
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 20000) {
      Message({
        message: res.message || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
          confirmButtonText: 'Re-Login',
          cancelButtonText: 'Cancel',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      loading.close()
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      loading.close()
      return res
    }
  },
  error => {
    loading.close()
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })

    return Promise.reject(error)
  }
)

export default service
