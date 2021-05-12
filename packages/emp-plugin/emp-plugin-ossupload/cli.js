// // 生成workspace本地配置
module.exports = program => {
  program
    .command('ossupload')
    .option('-n, --name <name>')
    .option('-v, --version <version>')
    .description(`同步yynpm资源到阿里云: -name 包名 -version 版本号`)
    .action(({name, version}) => {
      console.log('ossupload type:', name, version)
      require('./script/ossupload')(name, version)
    })
}
