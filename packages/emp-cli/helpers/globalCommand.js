const fs = require('fs')
const path = require('path')
const execSync = require('child_process').execSync

function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', {stdio: 'ignore'})
    return true
  } catch (e) {
    return false
  }
}

module.exports = program => {
  let npmGlobalModules = null
  let yarnGlobalModules = null
  const useYarn = shouldUseYarn()
  try {
    npmGlobalModules = execSync('npm root -g').toString().trim()
    // yarn global dir
    if (useYarn) {
      yarnGlobalModules = execSync('yarn global dir').toString().trim()
      yarnGlobalModules = path.join(yarnGlobalModules, 'node_modules')
    }
  } catch (e) {
    console.error(e)
  }
  const op = {}
  const prefix = 'emp-plugin-'
  op.npm = npmGlobalModules
  op.yarn = yarnGlobalModules
  //====================================
  // local npm yarn or more (pnpm,cnpm)?
  let cliEnv = 'local'
  Object.keys(op).map(k => {
    if (process.mainModule.path.indexOf(op[k]) > -1) {
      return (cliEnv = k)
    }
  })
  // cliEnv = 'yarn' //test
  // 全局下 emp，走全局插件
  if (cliEnv !== 'local') {
    fs.readdirSync(op[cliEnv]).map(d => {
      if (d.indexOf(prefix) > -1) {
        const fn = require(path.join(op[cliEnv], d, 'cli.js'))
        fn(program)
      }
    })
  } else {
    /*
    非全局下 emp：
    在项目里的 emp 走 deps 里的插件
    和非项目非全局的 emp ，例如 npx，不走插件
   */
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    if (fs.existsSync(packageJsonPath)) {
      let deps = require(packageJsonPath)
      deps = {...(deps.dependencies || {}), ...(deps.devDependencies || {})}
      Object.keys(deps).map(d => {
        if (d.indexOf(prefix) > -1) {
          const fn = require(`${d}/cli`)
          fn(program)
        }
      })
    }
  }
}
