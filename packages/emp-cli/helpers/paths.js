const path = require('path')
const fs = require('fs-extra')

//
const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)
const appPackageJson = resolveApp('package.json')
// console.log('__dirname===>', __dirname, path.join(__dirname, '../template/public/favicon.ico'))
let paths = {}

const existsEntry = relativePath => fs.pathExists(resolveApp(relativePath))
const defaultEntry = async () => {
  const [isIndexTS, isMainTS, isMainJS] = await Promise.all([
    existsEntry('src/index.ts'),
    existsEntry('src/main.ts'),
    existsEntry('src/main.js'),
  ])
  if (isIndexTS) return resolveApp('src/index.ts')
  else if (isMainTS) return resolveApp('src/main.ts')
  else if (isMainJS) return resolveApp('src/main.js')
  else return resolveApp('src/index.js')
}
const setPaths = async ({src, dist, public}) => {
  const appRoot = appDirectory
  const appSrc = src ? resolveApp(src) : resolveApp('src')
  const entry = src ? resolveApp(src) : await defaultEntry()
  dist = dist ? resolveApp(dist) : resolveApp('dist')
  public = public ? resolveApp(public) : resolveApp('public')
  let favicon = path.join(public, 'favicon.ico')
  let template = path.join(public, 'index.html')
  const empjson = resolveApp('./emp.json')
  const empjsonDist = resolveApp('dist/emp.json')
  const docsDist = resolveApp('dist/docs') // 最终文档md文件存放的dist目录
  favicon = fs.existsSync(favicon) ? favicon : path.join(__dirname, '../template/public/favicon.ico')
  template = fs.existsSync(template) ? template : path.join(__dirname, '../template/public/index.html')
  appPath = resolveApp('.')
  paths = {
    appRoot,
    appSrc,
    appPath,
    appPackageJson,
    entry,
    dist,
    public,
    favicon,
    template,
    empjson,
    empjsonDist,
    docsDist,
  }
}
const getPaths = () => paths
const cachePaths = {
  eslint: path.resolve(appDirectory, 'node_modules/.cache/.eslintcache'),
  webpack: path.resolve(appDirectory, 'node_modules/.cache/webpack'),
  buildConfig: path.resolve(appDirectory, 'node_modules/.cache/.buildConfigCache.json'),
}
module.exports = {
  resolveApp,
  getPaths,
  setPaths,
  cachePaths,
  appPackageJson,
}
