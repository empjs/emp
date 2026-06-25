import assert from 'node:assert/strict'
import {existsSync} from 'node:fs'
import path, {join} from 'node:path'
import {discoverApps, runBench, validateApps} from './apps.mjs'

const repoRoot = path.resolve(import.meta.dirname, '..')

const apps = await discoverApps(repoRoot)
const appNames = apps.map(app => app.name).sort()
const appDirs = apps.map(app => app.dir).sort()

assert.ok(appNames.includes('rspack2-modern-module'))
assert.ok(appNames.includes('rspack2-optimization'))

for (const dir of ['mf-host', 'mf-app', 'vue-3-base', 'vue-3-project', 'tailwind-4']) {
  assert.ok(appDirs.includes(dir), `apps must include migrated demo: ${dir}`)
}

assert.equal(existsSync(join(repoRoot, 'projects')), false)

const issues = await validateApps(apps)
assert.deepEqual(issues, [])

const dryRunResults = await runBench({
  apps: ['rspack2-modern-module', 'rspack2-optimization'],
  cwd: repoRoot,
  dryRun: true,
})

assert.equal(dryRunResults.length, 2)
assert.deepEqual(
  dryRunResults.map(result => result.name),
  ['rspack2-modern-module', 'rspack2-optimization'],
)
assert.ok(dryRunResults.every(result => result.command.includes('pnpm --filter')))
assert.deepEqual(
  dryRunResults.map(result => result.command),
  [
    'pnpm --filter ./apps/rspack2-modern-module build',
    'pnpm --filter ./apps/rspack2-optimization build',
  ],
)
assert.ok(dryRunResults.every(result => result.durationMs === 0))
assert.ok(dryRunResults.every(result => typeof result.distSizeBytes === 'number'))
assert.ok(dryRunResults.every(result => Array.isArray(result.assets)))
