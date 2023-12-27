import inquirer from 'inquirer'
import axios from 'axios'
import git from 'git-promise'
import fs from 'fs-extra'
// import ora from 'ora'
import store from 'src/helper/store'
import {cliOptionsType, modeType} from 'src/types'
import {createSpinner} from 'nanospinner'
import path from 'path'
import logger from 'src/helper/logger'
import templates from 'src/config/templates'
class Init {
  // templates: any = store.config.initTemplates
  templates: any = templates
  private checkScriptRun() {
    if (process.env.npm_execpath?.includes('pnpm')) return 'pnpm'
    else if (process.env.npm_execpath?.includes('yarn')) return 'yarn'
    else return 'npm'
  }
  async checkData(url: string) {
    try {
      if (/^http(s)?:\/\/.+/.test(url)) {
        const {data} = await axios.get(url)
        if (typeof data === 'object') return data
      } else {
        const filepath = path.join(process.cwd(), url)
        const d = require(filepath)
        if (typeof d === 'object') return d
      }
    } catch (e) {
      logger.error(e)
      return undefined
    }
    return undefined
  }
  async setup(cliOptions: cliOptionsType) {
    // console.log(process.env.npm_execpath, cliOptions)
    if (typeof cliOptions.data === 'string') {
      const data = await this.checkData(cliOptions.data)
      if (data) {
        this.templates = data
      }
    }
    await this.selectTemplate()
  }
  /**
   * 选择模板
   */
  async selectTemplate() {
    const templateNameList = []
    for (const item in this.templates) {
      templateNameList.push(item)
    }
    let answers: any = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: '请输入项目名:',
        default: function () {
          return 'emp-project'
        },
      },
      {
        type: 'list',
        name: 'template',
        message: '请选择模板:',
        choices: templateNameList,
      },
    ])
    let downLoadUrl = this.templates[answers.template]
    const downLoadName = answers.name
    if (answers.template === 'other') {
      answers = await inquirer.prompt([
        {
          name: 'other',
          message: '请输入自定义模板git地址:',
          type: 'input',
        },
      ])
      // downLoadName = '自定义模板'
      downLoadUrl = answers['other']
    }
    // console.log('answers',answers,downLoadUrl,downLoadName)
    await this.downloadRepo(downLoadUrl, `${downLoadName}`, '')
  }
  /**
   * 下载仓库
   * @param repoPath
   * @param localPath
   * @param branch
   */
  async downloadRepo(repoPath: string, localPath: string, branch: string) {
    const spinner = createSpinner().start()
    spinner.start({text: `[downloading]\n`})
    branch = branch ? `-b ${branch} --` : '--'
    repoPath = `clone ${branch} ${repoPath} ./${localPath}`
    if (!fs.existsSync(localPath)) {
      await git(repoPath)
      fs.removeSync(`./${localPath}/.git`)
      try {
        fs.unlinkSync(`./${localPath}/pnpm-lock.yaml`)
      } catch (error) {}
      const npmName = this.checkScriptRun()
      spinner.success({
        text: `cd ${localPath} && ${npmName === 'npm' ? 'npm i' : npmName} && ${
          npmName === 'npm' ? 'npm run' : npmName
        } dev`,
      })
    } else {
      spinner.error({text: `This directory already exists`})
    }
  }
}
export default new Init()
