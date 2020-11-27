import axios from 'axios'
const http = axios.create({
  baseURL: '',
})

http.interceptors.request.use(
  req => {
    return req
  },
  error => {
    return Promise.reject(error)
  },
)

http.interceptors.response.use(
  response => {
    if (response.data.code === 0 || response.data) {
      return response.data.data || response.data
    } else {
      return response.data || response
    }
  },
  error => {
    return Promise.reject(error)
  },
)
export default http
