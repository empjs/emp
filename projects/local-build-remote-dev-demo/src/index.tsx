import {reactAdapter} from '@empjs/share/adapter'
import rt from '@empjs/share/runtime'
// 实例化
rt.init({
  name: 'runtime_app',
  shared: reactAdapter.shared,
  remotes: [],
})
// 动态注册
rt.register([
  {
    name: 'localbuildremotedevdemo',
    entry: `http://${process.env.ip}:7001/emp.json`,
    alias: 'rc',
  },
])
import('./bootstrap')
