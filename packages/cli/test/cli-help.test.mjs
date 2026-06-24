import assert from 'node:assert/strict'
import {execFile as execFileCallback} from 'node:child_process'
import path from 'node:path'
import {promisify} from 'node:util'

const execFile = promisify(execFileCallback)
const repoRoot = path.resolve(import.meta.dirname, '../../..')

const {stdout} = await execFile(
  process.execPath,
  [path.join(repoRoot, 'packages/cli/bin/emp.js'), 'dev', '--help'],
  {cwd: repoRoot, maxBuffer: 1024 * 1024},
)

assert.match(stdout, /--hot/)
assert.doesNotMatch(stdout, /-h, --hot/)
assert.match(stdout, /-H, --hot/)
assert.match(stdout, /显示帮助/)
