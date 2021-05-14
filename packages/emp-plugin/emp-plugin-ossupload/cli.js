module.exports = program => {
  program
    .command('ossupload [packageName] [packageVersion]')
    .description(`同步yynpm资源到阿里云: ossupload [包名] [版本号] 默认获取当前包信息`)
    .action((packageName, packageVersion) => {
      console.log('ossupload type:', packageName, packageVersion)
      require('./script/ossupload')(packageName, packageVersion)
    })
}
