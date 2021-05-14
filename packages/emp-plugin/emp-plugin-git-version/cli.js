#!/usr/bin/env node
/* eslint no-console:off */

'use strict'
const path = require('path')
const fs = require('fs-extra')
const execa = require('execa')
const [arg0, arg1, regexpName, replaceName] = process.argv
console.log('args: ', regexpName, replaceName)

const appDirectory = fs.realpathSync(process.cwd())
const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

function getGitBranch() {
  const res = execa.commandSync('git rev-parse --abbrev-ref HEAD')
  return res.stdout
}
function init() {
  const result = fs.readFileSync(resolveApp('package.json'))
  const content = JSON.parse(result)
  const gitBranchName = getGitBranch()
  let version = content.version
  console.log('currentBranchName: ', gitBranchName)
  try {
    const matchResult = gitBranchName.match(new RegExp(regexpName, 'i'))
    if (regexpName && matchResult) {
      version = gitBranchName.replace(new RegExp(regexpName, 'i'), replaceName || '')
      console.log('version: ', version)
      content.version = version
      fs.writeFileSync(resolveApp('package.json'), JSON.stringify(content, null, 2))
    }
  } catch (e) {}
}
init()
