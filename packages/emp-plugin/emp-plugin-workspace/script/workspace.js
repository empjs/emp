/**
 * 生成本地开发配置
 */
const fs = require('fs')
const fse = require('fs-extra')
const axios = require('axios')
const {tsCompile, requireFromString} = require('../helps/compile')

// todo 获取 emp.config 的配置，动态生成@fileTemplate内容
const {resolveApp} = require('../helps/paths')
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
       `

/**
 * 初始化 工作区开发配置， 并追加 gitignore 配置
 */
const init = async () => {
  const isExists = await fse.pathExists(configFilePath)
  if (isExists) {
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
}

const getRemoteTsConfig = async () => {
  const workspaceConfigPath = resolveApp(configFilePath)
  const isExists = await fse.pathExists(workspaceConfigPath)
  if (isExists) {
    let remoteTsConfig = await fse.readFile(workspaceConfigPath, 'utf8')
    remoteTsConfig = await tsCompile(remoteTsConfig)
    remoteTsConfig = requireFromString(remoteTsConfig.code, '')
    return remoteTsConfig
  } else {
    return null
  }
}

/**
 * 同步远程文件
 */
const pullTypes = async () => {
  const isExists = await fse.pathExists(`${resolveApp('types')}`)
  if (!isExists) {
    await fse.mkdir(`${resolveApp('types')}`)
  }
  const remoteTsConfig = await getRemoteTsConfig()
  if (remoteTsConfig.default.pullConfig && Object.keys(remoteTsConfig.default.pullConfig).length > 0) {
    for (let key in remoteTsConfig.default.pullConfig) {
      if (
        remoteTsConfig.default.pullConfig[key].indexOf('http://') > -1 ||
        remoteTsConfig.default.pullConfig[key].indexOf('https://') > -1
      ) {
        downloadHttpFile(key, remoteTsConfig.default.pullConfig[key])
      } else {
        copyLocalFile(key, remoteTsConfig.default.pullConfig[key])
      }
    }
  } else {
    console.log(`请使用 emp workspace:init 指令生成配置文件 并配置pullConfig`)
  }
}

/**
 * 下载远程文件
 * @param {*} type
 */
const downloadHttpFile = async (path, remoteUrl) => {
  await downloadHttpFileAct(`${resolveApp('types')}/${path}.d.ts`, remoteUrl)
}

/**
 * 下载远程文件
 * @param {*} type
 */
const downloadHttpFileAct = async (path, remoteUrl) => {
  console.log(`下载文件${remoteUrl}到${path}`)
  const file = fse.createWriteStream(path)
  const response = await axios({
    url: `${remoteUrl}?fetchTime=${new Date().getTime()}`,
    method: 'GET',
    responseType: 'stream',
  })

  await response.data.pipe(file)
}

/**
 * 复制本地文件
 * @param {*} type
 */
const copyLocalFile = async (path, localUrl) => {
  const isExists = await fse.pathExists(localUrl)
  if (isExists) {
    fse.copy(localUrl, `${resolveApp('types')}/${path}.d.ts`)
  } else {
    console.log('本地文件不存在:', localUrl)
  }
}

/**
 * 分发远程文件
 * @param {*} type
 */
const pushTypes = async () => {
  const remoteTsConfig = await getRemoteTsConfig()
  if (!remoteTsConfig.default.pushConfig || remoteTsConfig.default.pushConfig.localPath.length < 1) {
    console.log('请使用 emp workspace:init 指令生成配置文件 并配置pushConfig')
  } else {
    const localPathPath = resolveApp(remoteTsConfig.default.pushConfig.localPath)
    const remotePath = remoteTsConfig.default.pushConfig.remotePath
    const isExists = await fse.pathExists(localPathPath)
    console.log(localPathPath, `isExists:`, isExists)
    if (remotePath && remotePath.length > 0) {
      remotePath.forEach(item => {
        fse.copy(localPathPath, item)
      })
    }
  }
}

/**
 * 生产本地配置文件， 并根据当前环境配置 拉取 d.ts
 */
const configure = async pullEnv => {
  const localPath = `mf-local-workspace.js`
  const ignoreContext = `empconfig/${localPath}`
  const curEnv = pullEnv === `dev` ? 'development' : 'production'
  console.log('configure pullEnv:', pullEnv)
  const isExists = await fse.pathExists(`./empconfig/${localPath}`)
  console.log(`存在本地配置文件?`, isExists)
  if (!isExists) {
    console.log(`创建本地文件`)
    fse.copy(`./empconfig/mf-production.js`, `./empconfig/${localPath}`)
    const stats = await fse.stat(gitignorePath)
    if (stats) {
      const lines = fs.readFileSync(gitignorePath).toString().split('\n')
      if (lines.includes(ignoreContext)) {
        console.log(`${ignoreContext} 已忽略`)
      } else {
        fse.appendFile(gitignorePath, `\n${ignoreContext}`, err => {
          if (err) {
            console.log(`${gitignorePath}追加内容失败`)
          } else {
            console.log(`${gitignorePath}追加内容成功`)
          }
        })
      }
    }
  }
  console.log(`开始获取依赖，当前指定拉取环境:`, curEnv)
  let remoteTsConfig = await fse.readFile(`./empconfig/mf-production.js`, 'utf8')
  if (curEnv === 'development') {
    remoteTsConfig = await fse.readFile(`./empconfig/mf-development.js`, 'utf8')
  }
  remoteTsConfig = await tsCompile(remoteTsConfig)
  remoteTsConfig = requireFromString(remoteTsConfig.code, '')
  console.log('remoteTsConfig', remoteTsConfig.remotes)
  const isExistsDepends = await fse.pathExists(`${resolveApp('depends')}`)
  if (!isExistsDepends) {
    await fse.mkdir(`${resolveApp('depends')}`)
  }
  Object.values(remoteTsConfig.remotes).forEach(empUrl => {
    let subIndex = empUrl.indexOf('@')
    let downloadFileUrl = empUrl.substr(subIndex + 1).replace(/\/\w+.js/, '/index.d.ts')
    downloadHttpFileAct(`./depends/${empUrl.split('@')[0]}.d.ts`, downloadFileUrl)
  })
}

module.exports = (type, pullEnv) => {
  switch (type) {
    case 'init':
      init()
      break
    case 'pullTypes':
      pullTypes()
      break
    case 'pushTypes':
      pushTypes()
      break
    case 'configure':
      configure(pullEnv)
      break
  }
}
