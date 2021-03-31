/**
 * 生成本地开发配置
 */
const fs = require('fs')
const fse = require('fs-extra')
const axios = require('axios')
const {requireFromString} = require('../helpers/compile')
const prettier = require('prettier')
const {resolveApp} = require('../helpers/paths')
const kConfigFile = '/config/depend.json'
const kDevConfigFile = '/config/depend_dev.json'
const kPlugnFile = '/emp-build.js'

const kGitIgnoreFile = '.gitignore'
const kTsConfigFile = 'tsconfig.json'
const kDependsDir = 'depends'
const kBuildDir = 'build'

const kTsConfigTemplate = `{
  "extends": "@efox/emp-tsconfig",
  "compilerOptions": {
    "jsx": "react",
    "baseUrl": ".",
    "paths": {
      "src/*": ["src/*"]
    }
  },
  "include": [
    "src"
  ]
}`
const writeFile = (path, content, encoding = 'utf8') => {
  fse.writeFileSync(path, content, encoding)
}

const appendToIgnore = async text => {
  const ignoreFile = resolveApp(kGitIgnoreFile)
  let isExists = await fse.pathExists(ignoreFile)
  if (!isExists) {
    fse.createFileSync(ignoreFile)
  }

  let success = true
  try {
    let content = await fse.readFile(ignoreFile, 'utf8')

    let regex = new RegExp(text.replace('*', '\\*'), 'g')
    content = content.replace(regex, '')
    regex = new RegExp('\\n\\n', 'g')
    content = content.replace(/^[\n|\r\n]*|[\n|\r\n]*$/g, '')
    content && (content += '\n')
    content += text
    writeFile(ignoreFile, content)
  } catch (error) {
    success = false
  }
  if (!success) {
    console.error(`${kGitIgnoreFile}追加内容失败`)
  } else {
    console.log(`${kGitIgnoreFile}追加内容成功`)
  }
}

const appendTsInclude = async type => {
  const configFile = resolveApp(kTsConfigFile)
  let isExists = await fse.pathExists(configFile)
  if (!isExists) {
    fse.createFileSync(configFile)
    writeFile(configFile, kTsConfigTemplate)
  }
  try {
    let remoteConfig = await fse.readFile(configFile, 'utf8')
    remoteConfig = JSON.parse(remoteConfig)
    const {include = []} = remoteConfig
    const index = include.indexOf(type)
    if (index > -1) {
      include.splice(index, 1)
    }
    include.push(type)
    const context = prettier.format(JSON.stringify(remoteConfig), {
      printWidth: 80,
      tabWidth: 2,
      useTabs: true,
      parser: 'json',
    })
    writeFile(configFile, context)
  } catch (error) {
    console.error(`修改${kTsConfigFile}  失败!`)
    return
  }

  console.log(`修改${kTsConfigFile}  成功!`)
}
/**
 * 下载远程文件
 * @param {*} type
 */
const downloadRemoteFile = async (dir, {name, domain, version = ''}) => {
  const verDir = (version && `${version}/`) || ''
  const url = `${domain}/${verDir}index.d.ts`
  const fileName = `${dir}/${name}${version}.d.ts`

  console.info(`${name}======开始, to: ${fileName}, from: ${url}`)
  try {
    const file = fse.createWriteStream(fileName)
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    })

    await response.data.pipe(file)
  } catch (error) {
    console.error(`${name}======失败, dir: ${fileName}`)
    throw error
  }

  console.info(`${name}======完成, dir: ${fileName}`)
}

const configures = async env => {
  console.info('依赖初始化 开始=====================')
  const buildRoot = resolveApp(kBuildDir)
  let isExists = await fse.pathExists(buildRoot)
  if (isExists) {
    const dependsPath = resolveApp(kDependsDir)
    isExists = await fse.pathExists(dependsPath)
    if (!isExists) {
      fse.mkdirSync(dependsPath)
    } else {
      fse.emptyDirSync(dependsPath)
    }
    await appendToIgnore(kDependsDir)
    await appendTsInclude(kDependsDir)
    let configPath = resolveApp(`${kBuildDir}${kConfigFile}`)
    isExists = await fse.pathExists(configPath)
    if (isExists) {
      if (env === 'dev') {
        const devConfigName = `${kBuildDir}${kDevConfigFile}`
        const devConfigFile = resolveApp(devConfigName)
        isExists = await fse.pathExists(devConfigFile)
        if (!isExists) {
          fse.copyFileSync(configPath, devConfigFile)
        }
        configPath = devConfigFile
        await appendToIgnore(devConfigName)
      }
      try {
        let configs = await fse.readFile(configPath, 'utf8')
        configs = JSON.parse(configs)
        // remoteConfigFn = requireFromString(remoteConfigFn, '')
        // const configs = (await remoteConfigFn()) || []
        for (const name in configs) {
          const config = configs[name]
          if (!config) continue
          const {domain, version, remote} = configs[name]
          if (!remote) continue
          await downloadRemoteFile(dependsPath, {name, domain, version})
        }
      } catch (error) {
        console.error('依赖初始化 失败=====================')
        return
      }
    }

    const remotePlugn = resolveApp(`${kBuildDir}${kPlugnFile}`)
    isExists = await fse.pathExists(remotePlugn)

    if (isExists) {
      console.info('检查自定义构建 开始=====================')
      let success = true
      try {
        let remotePlugnFn = await fse.readFile(remotePlugn, 'utf8')
        remotePlugnFn = requireFromString(remotePlugnFn, '')
        await remotePlugnFn(env)
      } catch (error) {
        success = false
      }
      if (success) {
        console.info('检查自定义构建 完成=====================')
      } else {
        console.error('检查自定义构建 失败=====================')
      }
    }
  }

  console.info('依赖初始化 完成=====================')
}

const configRemotes = async () => {
  let result = null
  const buildRoot = resolveApp(kBuildDir)
  let isExists = await fse.pathExists(buildRoot)
  if (isExists) {
    let configPath = resolveApp(`${kBuildDir}${kDevConfigFile}`)
    isExists = await fse.pathExists(configPath)
    if (!isExists) {
      configPath = resolveApp(`${kBuildDir}${kConfigFile}`)
    }
    isExists = await fse.pathExists(configPath)
    if (isExists) {
      try {
        let configs = await fse.readFile(configPath, 'utf8')
        configs = JSON.parse(configs)
        result = {}
        for (const name in configs) {
          if (!name) continue
          const {root = name, domain, version} = configs[name]
          const sub = (version && `/${version}/`) || '/'
          result[name] = `${root}@${domain}${sub}emp.js`
        }
      } catch (error) {
        result = null
      }
    }

    return result
  }
}

module.exports = {configures, configRemotes}
