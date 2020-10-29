const git = require('git-promise') // 运行git命令

async function downloadRepo(repoPath, localPath, branch) {
  const _branch = branch ? `-b ${branch} --` : '--'
  const _repoPath = `clone ${_branch} ${repoPath} ${localPath}`
  return git(_repoPath)
}

module.exports = downloadRepo
