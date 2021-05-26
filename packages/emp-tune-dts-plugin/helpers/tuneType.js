const path = require('path')
const fs = require('fs-extra')
const md5 = require('md5')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

// 替换操作
function RepalceDts(fileData, regexp, replacement) {
  const reg = new RegExp(regexp, 'g')
  const newFileData = fileData.replace(reg, replacement)
  return newFileData
}

// 默认替换
function defaultRepalce(fileData, withVersion = false) {
  // 使用正则去掉结尾的 /index
  let newFileData = fileData.replace(/\/index'/g, "'")
  newFileData = newFileData.replace(/\/index"/g, '"')
  // 使用正则把 src/ 替换成 package.json 的 name
  const packagePath = resolveApp('package.json')
  const package = JSON.parse(fs.readFileSync(packagePath))
  const projectName = package.name
  newFileData = newFileData.replace(/'.*src?/g, `'${projectName}`)
  newFileData = newFileData.replace(/".*src?/g, `"${projectName}`)
  if (withVersion) {
    const replaceRegExp = new RegExp(projectName, 'g')
    const versionMatch = package.version.match(/(\d+).(\d+).(\d+)/)
    newFileData = newFileData.replace(replaceRegExp, `${package.name}v${versionMatch[1]}_${versionMatch[2]}`)
  }
  return newFileData
}

// 合并远程依赖类型
function mergeRemoteType(fileData) {
  const suffix = '.d.ts'
  const empTypeDir = path.resolve('empType')
  if (fs.existsSync(empTypeDir)) {
    const empTypeList = fs.readdirSync(empTypeDir)
    empTypeList.forEach(item => {
      if (item && item.match(suffix)) {
        const dtsPath = path.join(empTypeDir, item)
        const dts = fs.readFileSync(dtsPath, 'utf8')
        fileData = fileData + '\n' + dts
      }
    })
  }
  return fileData
}

const emptyFunc = newFileData => {
  return newFileData
}

function tuneType(createPath, createName, isDefault, operation = emptyFunc, withVersion = false) {
  // 获取 d.ts 文件
  const filePath = path.join(createPath, createName)
  const fileData = fs.readFileSync(filePath, {encoding: 'utf-8'})
  let newFileData = ''
  newFileData = fileData
  isDefault && (newFileData = defaultRepalce(fileData, withVersion))
  newFileData && (newFileData = operation(newFileData) ? operation(newFileData) : newFileData)
  // 合并 remote 的 d.ts
  newFileData = mergeRemoteType(newFileData)
  // 覆盖原有 index.d.ts
  fs.writeFileSync(filePath, newFileData, {encoding: 'utf-8'})
  // // 生成一个 md5 值命名的 index.d.ts
  // const md5Value = md5(newFileData)
  // const md5FilePath = path.join(createPath, `${md5Value}.d.ts`)
  // fs.writeFileSync(md5FilePath, newFileData, {encoding: 'utf-8'})
}
module.exports = {tuneType}
