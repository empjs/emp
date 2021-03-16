// 插件
const empPlugin = {
  name: 'empPlugin',
  option: [],
  exec: function () {
    console.log('Hello emp plugin')
  },
}

register(empPlugin)
