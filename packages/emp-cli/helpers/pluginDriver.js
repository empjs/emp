const {resolveApp} = require('../helpers/paths')
const fs = require('fs')
const commander = require('commander')
module.exports = {
  pluginDriver(program) {
    const appPath = resolveApp('')
    const extraPath = `${appPath}/emp-extra.js`
    // register 暴露给第三方进行注册 plugin
    const register = plugin => {
      program.command(plugin.name).action(plugin.exec)
    }
    if (fs.existsSync(extraPath)) {
      let empExtra = fs.readFileSync(extraPath, 'utf8')
      eval(empExtra)
    }
    return program
  },
}
