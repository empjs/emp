const {resolveApp} = require('../helpers/paths')
const fs = require('fs')
const commander = require('commander')
const child_process = require('child_process')
const path = require('path')

module.exports = {
  pluginDriver(program) {
    const appPath = resolveApp('')
    const extraPath = path.join(appPath, 'emp-extra.js')

    const globalPlugin = () => {
      const empPlugin = []
      const npmGlobalModules = child_process.execSync('npm root -g').toString()
      const yarnGlobalModules = child_process.execSync('yarn global dir').toString()
      const yarnModulesPath = fs.readdirSync(path.join(yarnGlobalModules.trim(), 'node_modules'))
      const npmModulesPath = fs.readdirSync(npmGlobalModules.trim())
      npmModulesPath.forEach(item => {
        if (item && item.match('emp-plugin-')) {
          empPlugin.push(path.join(npmGlobalModules.trim(), item, 'index.js'))
        }
      })
      yarnModulesPath.forEach(item => {
        if (item && item.match('emp-plugin-')) {
          empPlugin.push(path.join(yarnGlobalModules.trim(), 'node_modules', item, 'index.js'))
        }
      })

      const cwd = process.cwd()
      if (cwd.match('emp-plugin-')) {
        const localPath = cwd.split(path.sep)
        localPath.forEach((item, index) => {
          if (item.indexOf('emp-plugin-') > -1) {
            const pluginPath = path.join(path.sep, ...localPath.slice(0, index + 1))
            empPlugin.push(path.join(pluginPath, 'index.js'))
          }
        })
      }
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
      if (plugin.description) {
        eval(
          `program.command(plugin.name).description(plugin.description)${optionsMerge(plugin.options)}.action(${
            plugin.exec
          })`,
        )
      } else {
        eval(`program.command(plugin.name)${optionsMerge(plugin.options)}.action(${plugin.exec})`)
      }
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
