const git = require('git-promise') // 运行git命令
const chalk = require('chalk')

async function downloadRepo(repoPath, localPath, branch) {
  const _branch = branch ? `-b ${branch} --` : '--'
  const _repoPath = `clone ${_branch} ${repoPath} ./${localPath}`
  await git(_repoPath)
  console.log('初始化完成，请输入:')
  console.log(chalk.green(`cd ${localPath} && yarn && yarn dev`))
}

module.exports = downloadRepo
