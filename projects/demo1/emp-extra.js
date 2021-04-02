// 局部插件开发例子
registerCommand({
  name: 'hello',
  options: [{name: '-i, --item <item>', description: 'flavour of pizza'}],
  exec: ({item}) => {
    console.log(`hello ${item}`)
  },
})
