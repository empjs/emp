module.exports = program => {
  program
    .command('dts:sync')
    .option('-e, --env <env>', '部署环境 dev、test、prod 默认为 prod')
    .action(({env}) => {
      console.log(`dts sync ${env}`)
    })
}
