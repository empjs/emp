// 全部插件开发例子
registerCommand({
  command: 'helloGlobalPlugin',
  description: 'It is description',
  options: [{name: '-i, --item <item>', description: 'flavour of pizza'}],
  action: ({item}) => {
    console.log(`global ${item}`)
  },
})
