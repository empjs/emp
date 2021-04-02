const path = require('path')
const fs = require('fs-extra')

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

const emptyFunc = newFileData => {
  return newFileData
}

function tuneType(createPath, createName, isDefault, operation = emptyFunc, withVersion = false) {
  // 获取 d.ts 文件
  const filePath = `${createPath}/${createName}`
  const fileData = fs.readFileSync(filePath, {encoding: 'utf-8'})
  let newFileData = ''
  newFileData = fileData
  isDefault && (newFileData = defaultRepalce(fileData, withVersion))
  // }
  newFileData && (newFileData = operation(newFileData) ? operation(newFileData) : newFileData)
  // 覆盖原有 index.d.ts
  fs.writeFileSync(filePath, newFileData, {encoding: 'utf-8'})
}
module.exports = {tuneType}
