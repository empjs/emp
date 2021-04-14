const child_process = require('child_process')
const fs = require('fs')
const path = require('path')
module.exports = program => {
  let npmGlobalModules = null
  let yarnGlobalModules = null
  try {
    npmGlobalModules = child_process.execSync('npm root -g').toString().trim()
    // yarn global dir
    yarnGlobalModules = child_process.execSync('yarn global dir').toString().trim()
    yarnGlobalModules = path.join(yarnGlobalModules, 'node_modules')
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
  if (cliEnv !== 'local') {
    fs.readdirSync(op[cliEnv]).map(d => {
      if (d.indexOf(prefix) > -1) {
        const fn = require(path.join(op[cliEnv], d, 'cli.js'))
        fn(program)
      }
    })
  } else {
    const packageJsonPath = path.join(process.cwd(), 'package.json')
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
