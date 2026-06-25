import rt from '@empjs/share/runtime'

// 实例化
rt.init({
  name: 'vue2App',
  shared: {},
  remotes: [],
})
// 动态注册
rt.register([
  {
    name: 'vue3Host',
    entry: `http://${process.env.ip}:9901/emp.json`,
    alias: 'v3h',
  },
])
