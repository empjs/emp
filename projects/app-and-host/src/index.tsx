import {shared} from '@empjs/share/react'
import {createInstance} from '@empjs/share/sdk'
import {ip, port} from './config'

// console.log('reactAdapter', reactAdapter)
// 实例化
export const mf = createInstance({
  name: 'app_and_host',
  shared: shared(),
  remotes: [],
})
// 动态注册
// console.log(window.origin)
const remotePort = window.origin.includes('3712') ? 3710 : 3712
mf.registerRemotes([
  {
    name: `app_host_${remotePort}`, //(*)不能与主项目重名
    entry: `http://${ip}:${remotePort}/emp.json`,
    alias: '@ah',
  },
])
//
import('./bootstrap')
