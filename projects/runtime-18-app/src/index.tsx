import {reactAdapter} from '@empjs/share/adapter'
import rt from '@empjs/share/runtime'
// 实例化
rt.init({
  name: 'runtimeHost_18_app',
  shared: reactAdapter.shared,
  remotes: [],
})
// 动态注册
rt.register([
  {
    name: 'runtimeHost_3911',
    entry: `http://${process.env.ip}:3911/emp.json`,
    alias: 'r91',
  },
  {
    name: 'runtimeHost_3912',
    entry: `http://${process.env.ip}:3912/emp.json`,
    alias: 'r92',
  },
])
//
import('./bootstrap')
