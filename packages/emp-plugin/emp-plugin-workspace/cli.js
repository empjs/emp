// // 生成workspace本地配置
module.exports = program => {
  program
    .command('workspace')
    .option('-t, --type <type>')
    .description([
      `本地开发配置:`,
      `[-t init]: 生成配置文件，如:声明文件同步配置`,
      `[-t pullTypes]:根据workspace:init配置文件的内容，拉取"远程"或"本地"声明文件到本地types目录`,
      `[-t pushTypes]: 根据workspace:init配置文件的内容，分发声明文件到"本地"远程目录`,
    ])
    .action(({type}) => {
      console.log('workspace type:', type)
      require('./script/workspace')(type)
    })
}
