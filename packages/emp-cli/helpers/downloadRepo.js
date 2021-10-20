const git = require('git-promise') // 运行git命令
const chalk = require('chalk')
const fs = require('fs-extra')
const ora = require('ora')

async function downloadRepo(repoPath, localPath, branch) {
  const spinner = ora('正在拉取模板...').start()
  const _branch = branch ? `-b ${branch} --` : '--'
  const _repoPath = `clone ${_branch} ${repoPath} ./${localPath}`
  if (!fs.existsSync(localPath)) {
    await git(_repoPath)
    fs.removeSync(`./${localPath}/.git`)
    spinner.succeed('init 成功,执行以下命令启动项目')
    console.log(chalk.green(`cd ${localPath} && yarn && yarn dev`))
  } else {
    console.log('已存在指定目录')
    spinner.warn('init 失败')
  }
}

module.exports = downloadRepo
