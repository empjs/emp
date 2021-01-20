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
function defaultRepalce(fileData) {
  // 使用正则去掉结尾的 /index
  let newFileData = fileData.replace(/\/index'/g, "'")
  newFileData = newFileData.replace(/\/index"/g, '"')
  // 使用正则把 src/ 替换成 package.json 的 name
  const packagePath = resolveApp('package.json')
  const package = JSON.parse(fs.readFileSync(packagePath))
  const projectName = package.name
  newFileData = newFileData.replace(/'.*src?/g, `'${projectName}`)
  newFileData = newFileData.replace(/".*src?/g, `"${projectName}`)
  return newFileData
}

const emptyFunc = newFileData => {
  return newFileData
}

function tuneType(createPath, createName, isDefault, operation = emptyFunc) {
  // 获取 d.ts 文件
  const filePath = `${createPath}/${createName}`
  const fileData = fs.readFileSync(filePath, {encoding: 'utf-8'})
  let newFileData = ''

  // 获取项目 tsconfig.json 路径
  // const tsconfigPath = resolveApp('tsconfig.json')
  // if (fs.existsSync(tsconfigPath)) {
  //   const config = JSON.parse(fs.readFileSync(tsconfigPath))
  //   const tuneType = config.tuneType

  //   // 有tuneType则根据配置替换，无则默认替换
  //   if (tuneType) {
  //     newFileData = fileData
  //     tuneType.map(item => {
  //       console.log(item)
  //       newFileData =
  //         item.origin && item.replacement
  //           ? RepalceDts(newFileData, item.origin, item.replacement)
  //           : defaultRepalce(fileData)
  //     })
  //   } else {
  //     newFileData = defaultRepalce(fileData)
  //   }
  // } else {
  newFileData = fileData
  isDefault && (newFileData = defaultRepalce(fileData))
  // }
  newFileData && (newFileData = operation(newFileData) ? operation(newFileData) : newFileData)
  // 覆盖原有 index.d.ts
  fs.writeFileSync(filePath, newFileData, {encoding: 'utf-8'})
}
module.exports = {tuneType}
