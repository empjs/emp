// #!/usr/bin/env node
// 'use strict'
const path = require('path')
const fs = require('fs-extra')
const execa = require('execa')

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

function getGitBranch() {
  try {
    const res = execa.commandSync('git rev-parse --abbrev-ref HEAD')
    return res.stdout
  } catch (e) {}
}

function init({regexpName, replaceName}) {
  const result = fs.readFileSync(resolveApp('package.json'))
  const content = JSON.parse(result)
  const gitBranchName = getGitBranch()
  let version = content.version
  try {
    const matchResult = gitBranchName.match(new RegExp(regexpName, 'i'))
    if (regexpName && matchResult && gitBranchName) {
      console.log('currentBranchName: ', gitBranchName)
      version = gitBranchName.replace(new RegExp(regexpName, 'i'), replaceName || '')
      if (version !== content.version) {
        content.version = version
        fs.writeFileSync(resolveApp('package.json'), JSON.stringify(content, null, 2))
      }
      console.log('modify version: ', version)
      console.log('success')
    } else {
      console.log('git verion lint end')
    }
  } catch (e) {}
}

module.exports = program => {
  program
    .command('gitversionlint')
    .description([`更新package.json版本号`])
    .option('-n, --regexpname <regexpname>', '正则匹配，如commit-, "commit-|master-"')
    .option(
      '-rn, --replacename <replacename>',
      '正则替换name的内容，如hotfix-, build-, xxx进行替换-n，或--name匹配到的内容',
    )
    .action(({regexpname, replacename}) => {
      console.log('regexpname: ', regexpname, ' replacename:', replacename)
      init({regexpName: regexpname, replaceName: replacename})
    })
}
