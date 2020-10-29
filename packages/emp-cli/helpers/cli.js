const semver = require('semver') // 语义化版本控制模块
const chalk = require('chalk')

module.exports = {
  // 检查node版本
  checkNodeVersion(wanted, id) {
    if (!semver.satisfies(process.version, wanted)) {
      console.log(
        chalk.red.bold.bgBlack(
          `You are using Node ${process.version}, but this version of ${id} requires Node ${wanted}.\nPlease upgrade your Node version.`,
        ),
      )
      process.exit(1)
    }
  },
  // commander passes the Command object itself as options,
  // extract only actual options into a fresh object.
  cleanArgs(cmd) {
    const args = {}
    cmd.options.forEach(o => {
      const key = camelize(o.long.replace(/^--/, ''))
      // if an option is not present and Command has a method with the same name
      // it should not be copied
      if (typeof cmd[key] !== 'function' && typeof cmd[key] !== 'undefined') {
        args[key] = cmd[key]
      }
    })
    return args
  },

  // 小驼峰转换
  camelize(str) {
    return str.replace(/-(\w)/g, (_, c) => (c ? c.toUpperCase() : ''))
  },
}
