// 局部插件开发例子
registerCommand({
  name: 'hello',
  description: 'It is description',
  options: [{name: '-i, --item <item>', description: 'flavour of pizza'}],
  exec: ({item}) => {
    console.log(`hello ${item}`)
  },
})
