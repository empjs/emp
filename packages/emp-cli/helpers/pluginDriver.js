const {resolveApp} = require('../helpers/paths')
const fs = require('fs')
const commander = require('commander')
module.exports = {
  pluginDriver(program) {
    const appPath = resolveApp('')
    const extraPath = `${appPath}/emp-extra.js`
    const optionsMerge = options => {
      let optionCall = ''
      if (options) {
        for (const item of options) {
          optionCall += `.option('${item.name}', '${item.description}')`
        }
      }
      return optionCall
    }
    // register 暴露给第三方进行注册 plugin
    const register = plugin => {
      eval(`program.command(plugin.name)${optionsMerge(plugin.options)}.action(${plugin.exec})`)
    }
    if (fs.existsSync(extraPath)) {
      let empExtra = fs.readFileSync(extraPath, 'utf8')
      eval(empExtra)
    }
    return program
  },
}
