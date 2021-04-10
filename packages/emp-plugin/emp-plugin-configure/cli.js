module.exports = program => {
  program
    .command('configure')
    .description([`依赖初始化`])
    .option('-e, --env <env>', '部署环境 dev、test、prod 默认为 prod')
    .action(({env}) => {
      env = env || 'prod'
      require('../scripts/configure')(env)
    })
}
