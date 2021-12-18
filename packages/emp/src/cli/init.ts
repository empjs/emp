import inquirer from 'inquirer'
import axios from 'axios'
import git from 'git-promise'
import chalk from 'chalk'
import fs from 'fs-extra'
// import ora from 'ora'
import store from 'src/helper/store'
import {cliOptionsType, modeType} from 'src/types'
import {spinner} from 'src/helper/spinner'
class Init {
  templates: any = {
    react: 'https://github.com/efoxTeam/emp-react-template.git',
    vue2: 'https://github.com/efoxTeam/emp-vue2-template.git',
  }
  async setup(cliOptions: cliOptionsType) {
    console.log('[init]', cliOptions)
    setTimeout(() => {
      spinner.success({text: 'Successful!', mark: ':)'})
    }, 1000)
    // await this.selectTemplate()
  }
  /**
   * 选择模板
   */
  async selectTemplate() {
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
        choices: this.templates,
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
    // const spinner = ora('正在拉取模板...').start()
    branch = branch ? `-b ${branch} --` : '--'
    repoPath = `clone ${branch} ${repoPath} ./${localPath}`
    if (!fs.existsSync(localPath)) {
      await git(repoPath)
      fs.removeSync(`./${localPath}/.git`)
      // spinner.succeed('init 成功,执行以下命令启动项目')
      console.log(chalk.green(`cd ${localPath} && yarn && yarn dev`))
    } else {
      console.warn('已存在指定目录')
      // spinner.warn('init 失败')
    }
  }
}
export default new Init()
