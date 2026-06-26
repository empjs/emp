import {describe, expect, test} from '@rstest/core'
import {execFile as execFileCallback} from 'node:child_process'
import {existsSync, readdirSync} from 'node:fs'
import {join} from 'node:path'
import {promisify} from 'node:util'
import {DEFAULT_APP_ACCEPTANCE} from './apps.catalog.mjs'

const execFile = promisify(execFileCallback)
const repoRoot = process.cwd()

const expectedArtifacts: Record<string, string[]> = {
  'rspack2-modern-module': ['dist/index.html'],
  'rspack2-optimization': ['dist/index.html'],
  'mf-host': ['dist/emp.json', 'dist/emp.js'],
  'mf-app': ['dist/emp.json', 'dist/index.html'],
  'vue-3-base': ['dist/mf-manifest.json', 'dist/emp.js'],
  'vue-3-project': ['dist/mf-manifest.json', 'dist/index.html'],
  'tailwind-4': ['dist/index.html'],
  'react-19-tanstack': ['dist/index.html'],
}

describe('default apps real acceptance', () => {
  for (const appDir of DEFAULT_APP_ACCEPTANCE) {
    test(`${appDir} builds and emits expected artifacts`, async () => {
      const result = await execFile('pnpm', ['--filter', `./apps/${appDir}`, 'build'], {
        cwd: repoRoot,
        maxBuffer: 1024 * 1024 * 20,
      })

      expect(result.stderr).not.toContain('ERROR')
      for (const artifact of expectedArtifacts[appDir]) {
        expect(existsSync(join(repoRoot, 'apps', appDir, artifact))).toBe(true)
      }

      const distFiles = readdirSync(join(repoRoot, 'apps', appDir, 'dist'), {recursive: true})
      expect(distFiles.length).toBeGreaterThan(0)
    }, 120000)
  }
})
