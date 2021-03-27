/**
 * 生成本地开发配置
 */
const fs = require('fs')

// todo 获取 emp.config 的配置，动态生成@fileTemplate内容
// const {resolveApp} = require('../helpers/paths')
// const package = require(`${resolveApp('package.json')}`)
const configFilePath = `emp.workspace.config.ts`
const gitignorePath = `.gitignore`
const fileTemplate = `import {IWorkSpaceConfig} from '@efox/emp-cli/types/emp-workspace-config'

const empWorkspaceConfig: IWorkSpaceConfig = {
  pullConfig: {},
  pushConfig: {
    localPath: '',
    remotePath: [],
  },
}
export default empWorkspaceConfig
`

const ignoreAppendContent = `
${configFilePath}
types/
`

module.exports = () => {
  fs.stat(configFilePath, (err, stats) => {
    if (stats) {
      console.log(`${configFilePath}已存在, 创建失败`)
    } else {
      fs.writeFile(configFilePath, fileTemplate, err => {
        if (err) {
          console.log(`${configFilePath}创建失败 ${err}`)
        } else {
          console.log(`${configFilePath}创建成功`)
          fs.stat(gitignorePath, (err, stats) => {
            if (stats) {
              fs.appendFile(gitignorePath, ignoreAppendContent, err => {
                if (err) {
                  console.log(`${gitignorePath}追加内容失败`)
                } else {
                  console.log(`${gitignorePath}追加内容成功`)
                }
              })
            }
          })
        }
      })
    }
  })
}
