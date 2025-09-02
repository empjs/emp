import {reactAdapter} from '@empjs/share/adapter'
import rt from '@empjs/share/runtime'
import {ip, port} from './config'

const remotePort = 3710
// 实例化
rt.init({
  name: 'app_and_host',
  shared: reactAdapter.shared,
  remotes: [],
})
// 动态注册
rt.register([
  {
    name: `app_host_${remotePort}`, //(*)不能与主项目重名
    entry: `http://${ip}:${remotePort}/emp.json`,
    alias: '@ah',
  },
])
//
import('./bootstrap')
