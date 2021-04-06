registerCommand({
  name: 'dts-sync',
  options: [{name: '-e, --env <env>', description: '部署环境 dev、test、prod 默认为 prod'}],
  exec: ({env}) => {
    console.log(`dts sync ${env}`)
  },
})
