/**
 * 生成本地开发配置
 */
const fse = require('fs-extra')
const {tsCompile, requireFromString} = require('../helpers/compile')

// todo 获取 emp.config 的配置，动态生成@fileTemplate内容
const {resolveApp} = require('../helpers/paths')
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

/**
 * 初始化 工作区开发配置， 并追加 gitignore 配置
 */
const init = async () => {
  fse.stat(configFilePath, async (err, stats) => {
    if (stats) {
      console.log(`${configFilePath}已存在, 创建失败`)
    } else {
      await fse.createFile(configFilePath)
      const err = await fse.outputFile(configFilePath, fileTemplate)
      if (err) {
        console.log(`${configFilePath}创建失败 ${err}`)
      } else {
        console.log(`${configFilePath}创建成功`)
        const stats = await fse.stat(gitignorePath)
        if (stats) {
          fse.appendFile(gitignorePath, ignoreAppendContent, err => {
            if (err) {
              console.log(`${gitignorePath}追加内容失败`)
            } else {
              console.log(`${gitignorePath}追加内容成功`)
            }
          })
        }
      }
    }
  })
}

const pullTypes = async () => {
  console.log('begin pullTypes')
  const workspaceConfigPath = resolveApp(configFilePath)
  console.log(`workspaceConfig: ${workspaceConfigPath} `)
  fse.stat(workspaceConfigPath, async (err, stats) => {
    if (stats) {
      let remoteTsConfig = await fse.readFile(workspaceConfigPath, 'utf8')
      remoteTsConfig = await tsCompile(remoteTsConfig)
      remoteTsConfig = requireFromString(remoteTsConfig.code, '')
      console.log('## data', remoteTsConfig)
      console.log('## data', remoteTsConfig.default.pullConfig)
    }
  })
}

module.exports = type => {
  switch (type) {
    case 'init':
      init()
      break
    case 'pullTypes':
      pullTypes()
      break
  }
}
