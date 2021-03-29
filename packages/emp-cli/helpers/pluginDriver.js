const {resolveApp} = require('../helpers/paths')
const fs = require('fs')
const commander = require('commander')
const child_process = require('child_process')
module.exports = {
  pluginDriver(program) {
    const appPath = resolveApp('')
    const extraPath = `${appPath}/emp-extra.js`

    const globalPlugin = () => {
      const empPlugin = []
      const globalModules = child_process.execSync('npm root -g').toString()
      const modulesPath = fs.readdirSync(globalModules.trim())
      modulesPath.forEach(item => {
        if (item.match('emp-')) {
          empPlugin.push(`${globalModules.trim()}/${item}/index.js`)
        }
      })
      return empPlugin
    }

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

    const globalPluginPath = globalPlugin()
    globalPluginPath.forEach(pluginPath => {
      const globalPlugin = fs.readFileSync(pluginPath, 'utf8')
      eval(globalPlugin)
    })

    return program
  },
}
