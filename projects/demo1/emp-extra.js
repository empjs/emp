register({
  name: 'hello',
  options: [{name: '-i, --item <item>', description: 'flavour of pizza'}],
  exec: ({item}) => {
    console.log(`hell ${item}`)
  },
})
