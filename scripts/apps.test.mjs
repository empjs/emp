import assert from 'node:assert/strict'
import path from 'node:path'
import {discoverApps, runBench, validateApps} from './apps.mjs'

const repoRoot = path.resolve(import.meta.dirname, '..')

const apps = await discoverApps(repoRoot)
const appNames = apps.map(app => app.name).sort()

assert.ok(appNames.includes('rspack2-modern-module'))
assert.ok(appNames.includes('rspack2-optimization'))

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
assert.ok(dryRunResults.every(result => result.durationMs === 0))
assert.ok(dryRunResults.every(result => typeof result.distSizeBytes === 'number'))
assert.ok(dryRunResults.every(result => Array.isArray(result.assets)))
