const {resolveApp} = require('../helpers/paths')
const fs = require('fs')
module.exports = {
  pluginDriver(program) {
    // register 暴露给第三方进行注册 plugin
    const register = plugin => {
      program.command(plugin.name).action(() => {
        plugin.exec()
      })
    }
    const appPath = resolveApp('')
    let empExtra = fs.readFileSync(`${appPath}/emp-extra.js`, 'utf8')
    eval(empExtra)
    return program
  },
}
