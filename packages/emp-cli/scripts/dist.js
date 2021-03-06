// "deploy": "emp tsc && node ./deploy.js && emp dev"
// 目前只支持子项目路径为全路径和文件夹名称，如果是写文件夹名称，就必须保证子项目文件夹和base文件夹在同一层级
/**
 * package.json
 * {
 *  "childPath": [
 *      {
 *        "path": "子项目路径",
 *        "name": "index.d.ts"
 *      }
 *   ]
 * }
 */
const {resolveApp} = require('../helpers/paths')
const package = require(`${resolveApp('package.json')}`)
const {exec} = require('child_process')

module.exports = async ({ts, createName, createPath}) => {
  const pwd = () => {
    let arr = resolveApp('').split('/')
    arr.pop()
    return arr.join('/')
  }

  // 本地 package.json 里维护的一个字段
  const pathList = package.childPath || []
  if (pathList.length === 0) return
  pathList.forEach(i => {
    let shell
    // 只支持设置全路径和文件夹名字
    if (i.path.split('/').length > 1) {
      // 如果是全路径
      shell = `cp -r ${resolveApp(createPath || 'dist')}/${createName || 'index'}.d.ts ${i.path}\/src\/${
        i.name || package.name.replace('/', '-')
      }.d.ts`
    } else {
      // 如果只有文件夹名称，默认是和当前目录同层级的
      shell = `cp -r ${resolveApp(createPath || 'dist')}/${createName || 'index'}.d.ts ${pwd()}\/${i.path}\/src\/${
        i.name || package.name.replace('/', '-')
      }.d.ts`
    }

    exec(shell, (error, stdout, stderr) => {
      console.log('stdout: ' + stdout)
      console.log('stderr: ' + stderr)
      if (error !== null) {
        console.log('exec error: ' + error)
      }
    })
  })
  console.log('Deploy Successful')
}
