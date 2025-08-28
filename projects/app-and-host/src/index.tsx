import {reactAdapter} from '@empjs/share/adapter'
import rt from '@empjs/share/runtime'
import {ip, port} from './config'

// 实例化
rt.init({
  name: 'app_and_host',
  shared: reactAdapter.shared,
  remotes: [],
})
// 动态注册
rt.register([
  {
    name: `app_host_3712`, //(*)不能语主项目重名
    entry: `http://${ip}:3712/emp.json`,
    alias: '@ah',
  },
])
//
import('./bootstrap')
