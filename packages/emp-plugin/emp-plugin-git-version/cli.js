#!/usr/bin/env node
/* eslint no-console:off */

'use strict'
const path = require('path')
const fs = require('fs-extra')
const execa = require('execa')
const [arg0, arg1, regexpName, replaceName] = process.argv

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

function getGitBranch() {
  try {
    const res = execa.commandSync('git rev-parse --abbrev-ref HEAD')
    return res.stdout
  } catch (e) {}
}
function init() {
  const result = fs.readFileSync(resolveApp('package.json'))
  const content = JSON.parse(result)
  const gitBranchName = getGitBranch()
  let version = content.version
  try {
    const matchResult = gitBranchName.match(new RegExp(regexpName, 'i'))
    if (regexpName && matchResult && gitBranchName) {
      console.log('args: ', regexpName, replaceName)
      console.log('currentBranchName: ', gitBranchName)
      version = gitBranchName.replace(new RegExp(regexpName, 'i'), replaceName || '')
      console.log('modify version: ', version)
      content.version = version
      fs.writeFileSync(resolveApp('package.json'), JSON.stringify(content, null, 2))
      console.log('success')
    } else {
      console.log('done')
    }
  } catch (e) {}
}
init()

module.exports = program => {}
