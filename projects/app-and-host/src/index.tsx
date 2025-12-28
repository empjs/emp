import {registerRemotes} from '@empjs/share/sdk'

// import {ip, port} from './config'
const ip = 'localhost'
// 动态注册
// console.log(window.origin)
const remotePort = window.origin.includes('3712') ? 3710 : 3712
registerRemotes([
  {
    name: `app_host_${remotePort}`, //(*)不能与主项目重名
    entry: `http://${ip}:${remotePort}/emp.json`,
    alias: '@ah',
  },
])
//
import('./bootstrap')
