const fs = require('fs')
const child_process = require('child_process')
const path = require('path')
const Module = require('module')

module.exports = {
  pluginDriver(program) {
    const empPlugin = []
    const prefix = 'emp-plugin-'
    const npmGlobalModules = child_process.execSync('npm root -g').toString().trim()
    const yarnGlobalModules = child_process.execSync('yarn global dir').toString().trim()
    let isGlobalEmp = false

    if (__dirname.indexOf(yarnGlobalModules) > -1 || __dirname.indexOf(npmGlobalModules) > -1) {
      isGlobalEmp = true
    }

    // npm 全局 node_modules
    const getNpmGlobalModules = () => {
      if (fs.existsSync(npmGlobalModules)) {
        const npmModulesPath = fs.readdirSync(npmGlobalModules)
        npmModulesPath.forEach(item => {
          if (item && item.match(prefix)) {
            empPlugin.push(path.join(npmGlobalModules, item, 'index.js'))
          }
        })
      }
    }

    // yarn 全局 node_modules
    const getYarnGlobalModules = () => {
      if (fs.existsSync(yarnGlobalModules)) {
        const yarnModulesPath = fs.readdirSync(path.join(yarnGlobalModules, 'node_modules'))
        yarnModulesPath.forEach(item => {
          if (item && item.match(prefix)) {
            empPlugin.push(path.join(yarnGlobalModules, 'node_modules', item, 'index.js'))
          }
        })
      }
    }

    // 向上遍历 node_modules
    const getLocalModule = () => {
      const nodeModulePaths = Module._nodeModulePaths('')
      nodeModulePaths.forEach(nodeModule => {
        if (fs.existsSync(nodeModule)) {
          const nodeModulesDir = fs.readdirSync(nodeModule.trim())
          nodeModulesDir.forEach(item => {
            if (item && item.match(prefix)) {
              empPlugin.push(path.join(nodeModule, item, 'index.js'))
            }
          })
        }
      })
    }

    // 当前项目是不是 plugin 项目
    const getCwdModule = () => {
      const cwd = process.cwd()
      if (cwd.match(prefix)) {
        const localPath = cwd.split(path.sep)
        localPath.forEach((item, index) => {
          if (item.indexOf(prefix) > -1) {
            const pluginPath = path.join(path.sep, ...localPath.slice(0, index + 1))
            empPlugin.push(path.join(pluginPath, 'index.js'))
          }
        })
      }
    }

    const getPlugin = () => {
      if (isGlobalEmp) {
        getNpmGlobalModules()
        getYarnGlobalModules()
        getLocalModule()
      } else {
        getLocalModule()
      }
      getCwdModule()
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
          `program.command(plugin.command).description(plugin.description)${optionsMerge(plugin.options)}.action(${
            plugin.action
          })`,
        )
      } else {
        eval(`program.command(plugin.command)${optionsMerge(plugin.options)}.action(${plugin.action})`)
      }
    }

    getPlugin()
    empPlugin.forEach(pluginPath => {
      const plugin = fs.readFileSync(pluginPath, 'utf8')
      eval(plugin)
    })

    return program
  },
}
