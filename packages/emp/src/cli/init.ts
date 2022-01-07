import inquirer from 'inquirer'
import axios from 'axios'
import git from 'git-promise'
import chalk from 'chalk'
import fs from 'fs-extra'
// import ora from 'ora'
import store from 'src/helper/store'
import {cliOptionsType, modeType} from 'src/types'
import {createSpinner} from 'nanospinner'
class Init {
  templates: any = {
    vue2_base: 'https://github.com/efoxTeam/emp2-vue2-base.git',
    vue2_project: 'https://github.com/efoxTeam/emp2-vue2-project.git',
    react_base: 'https://github.com/efoxTeam/emp2-react-base.git',
    react_project: 'https://github.com/efoxTeam/emp2-react-project.git',
  }
  async setup(cliOptions: cliOptionsType) {
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
    const answers: any = await inquirer.prompt([
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
    await this.downloadRepo(this.templates[answers.template], `${answers.name}`, '')
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
      spinner.success({text: `cd ${localPath} && yarn && yarn dev`})
    } else {
      spinner.error({text: `This directory already exists`})
    }
  }
}
export default new Init()
