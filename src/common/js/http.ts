/* tslint:disable */
import axios from 'axios'
axios.defaults.baseURL = 'http://10.71.1.145:8088/' // http://10.71.1.145:8088//测试域名
axios.interceptors.request.use(config => {
  return config
}, error => {
  return Promise.reject(error)
})
axios.interceptors.response.use(response => response, error => Promise.resolve(error.response))
axios.defaults.withCredentials = false
function checkStatus (response:any) {
  if (!response) {
    return false
  }
  if (response.status === 200 || response.status === 304) {
    return response.data
  }
  return {
    code: -404,
    data: response.statusText,
    message: response.statusText
  }
}

function checkCode (res: any) {
  if (!res) {
    return false
  } else {
    return res
  }
}
export default {
  post (url: string, data?: any, noNeed?:boolean, type?:string) {
    const contentType = type === 'form' ? 'application/x-www-form-urlencoded; charset=UTF-8' :
     'application/json; charset=UTF-8'
    let _header = {}
    if (noNeed) {
      _header = {
        'Content-Type': contentType
      }
    } else {
      _header = {
        'Content-Type': contentType,
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'deviceId': sessionStorage.getItem('deviceId')
      }
    }
    return axios({
      method: 'post',
      url,
      data: data,
      timeout: 30000,
      headers: _header
    }).then(checkStatus).then(checkCode)
  },
  get (url:string, params?:any, noNeed?:boolean) {
    let _header = {}
    if (noNeed) {
      _header = {
        'X-Requested-With': 'XMLHttpRequest'
      }
    } else {
      _header = {
        'X-Requested-With': 'XMLHttpRequest',
        'Authorization': 'Bearer ' + sessionStorage.getItem('token'),
        'deviceId': sessionStorage.getItem('deviceId')
      }
    }
    return axios({
      method: 'get',
      url,
      params,
      timeout: 30000,
      headers: _header
    }).then(checkStatus).then(checkCode)
  }
}
