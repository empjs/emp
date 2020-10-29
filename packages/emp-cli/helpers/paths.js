const path = require('path')
const fs = require('fs-extra')

//
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
// console.log('__dirname===>', __dirname, path.join(__dirname, '../template/public/favicon.ico'))
let paths = {}
const setPaths = ({src, dist, public}) => {
  const appSrc = src ? resolveApp(src) : resolveApp('src')
  const entry = src ? resolveApp(src) : resolveApp('src/index.ts')
  dist = dist ? resolveApp(dist) : resolveApp('dist')
  public = public ? resolveApp(public) : resolveApp('public')

  let favicon = path.join(public, 'favicon.ico')
  let template = path.join(public, 'index.html')
  favicon = fs.existsSync(favicon) ? favicon : path.join(__dirname, '../template/public/favicon.ico')
  template = fs.existsSync(template) ? template : path.join(__dirname, '../template/public/index.html')
  paths = {appSrc, entry, dist, public, favicon, template}
}
const getPaths = () => paths
module.exports = {
  resolveApp,
  getPaths,
  setPaths,
}
