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
      const npmGlobalModules = child_process.execSync('npm root -g').toString()
      const yarnGlobalModules = child_process.execSync('yarn global dir').toString()
      const yarnModulesPath = fs.readdirSync(`${yarnGlobalModules.trim()}/node_modules`)
      const npmModulesPath = fs.readdirSync(npmGlobalModules.trim())
      npmModulesPath.forEach(item => {
        if (item && item.match('emp-plugin-')) {
          empPlugin.push(`${npmGlobalModules.trim()}/${item}/index.js`)
        }
      })
      yarnModulesPath.forEach(item => {
        if (item && item.match('emp-plugin-')) {
          empPlugin.push(`${yarnGlobalModules.trim()}/node_modules/${item}/index.js`)
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
    const registerCommand = plugin => {
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
