import {shared} from '@empjs/share/react'
import rt from '@empjs/share/runtime'
import {ip, port} from './config'

// console.log('reactAdapter', reactAdapter)
// 实例化
rt.init({
  name: 'app_and_host',
  shared: shared(),
  remotes: [],
})
// 动态注册
// console.log(window.origin)
const remotePort = window.origin.includes('3712') ? 3710 : 3712
rt.register([
  {
    name: `app_host_${remotePort}`, //(*)不能与主项目重名
    entry: `http://${ip}:${remotePort}/emp.json`,
    alias: '@ah',
  },
])
//
import('./bootstrap')
