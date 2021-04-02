// 全部插件开发例子
registerCommand({
  name: 'helloGlobalPlugin',
  options: [{name: '-i, --item <item>', description: 'flavour of pizza'}],
  exec: ({item}) => {
    console.log(`global ${item}`)
  },
})
