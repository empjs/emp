const git = require('git-promise') // 运行git命令
const chalk = require('chalk')
const fs = require('fs')

async function downloadRepo(repoPath, localPath, branch) {
  const _branch = branch ? `-b ${branch} --` : '--'
  const _repoPath = `clone ${_branch} ${repoPath} ./${localPath}`
  if (!fs.existsSync(localPath)) {
    await git(_repoPath)
    await fs.rmdir(`./${localPath}/.git`, {recursive: true}, err => {
      console.log(err)
    })
    console.log('初始化完成，请输入:')
    console.log(chalk.green(`cd ${localPath} && yarn && yarn dev`))
  } else {
    console.log('已存在指定目录')
  }
}

module.exports = downloadRepo
