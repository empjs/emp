import {describe, expect, test} from '@rstest/core'
import {execFile as execFileCallback} from 'node:child_process'
import {promisify} from 'node:util'
import {repoRoot} from './helpers/repo-root'

const execFile = promisify(execFileCallback)

describe('rc.1 external consumer acceptance', () => {
  test('packs core release packages and installs them in a temporary consumer project', async () => {
    const result = await execFile(process.execPath, ['scripts/rc1-consumer-smoke.mjs'], {
      cwd: repoRoot,
      maxBuffer: 1024 * 1024 * 20,
      timeout: 240000,
    })

    expect(result.stdout).toContain('rc1 consumer smoke passed')
    expect(result.stderr).not.toContain('workspace:')
  }, 240000)
})
