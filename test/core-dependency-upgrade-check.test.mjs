import assert from 'node:assert/strict'
import test from 'node:test'

import {
  compareVersions,
  extractVersionFromRange,
  judgeUpgrade,
  parseArgs,
  registryDisplayName,
  renderMarkdown,
  versionDelta,
} from '../scripts/core-dependency-upgrade-check.mjs'

const dependency = {name: '@rslib/core', tier: 'critical'}
const now = new Date('2026-08-05T08:00:00.000Z')

test('compares stable and prerelease versions', () => {
  assert.equal(compareVersions('1.0.0-beta.1', '0.23.2'), 1)
  assert.equal(compareVersions('1.0.0', '1.0.0-beta.1'), 1)
  assert.equal(versionDelta('0.23.2', '1.0.0-beta.1'), 'major')
  assert.equal(versionDelta('2.1.5', '2.1.8'), 'patch')
  assert.equal(versionDelta('0.11.4', '0.11.6'), 'patch')
})

test('extracts a baseline version from common manifest ranges', () => {
  assert.equal(extractVersionFromRange('^0.23.2'), '0.23.2')
  assert.equal(extractVersionFromRange('~2.1.5'), '2.1.5')
  assert.equal(extractVersionFromRange('workspace:*'), null)
})

test('accepts the pnpm argument separator', () => {
  assert.deepEqual(parseArgs(['--', '--format', 'json']), {
    format: 'json',
    failOn: 'none',
    registry: undefined,
  })
})

test('does not expose a configured private registry', () => {
  assert.equal(registryDisplayName('https://registry.npmjs.org/'), 'https://registry.npmjs.org')
  assert.equal(registryDisplayName('https://token@example.internal/npm/'), '<configured-registry>')
})

test('requires manual review for Rslib beta and config migration signals', () => {
  const packument = {
    time: {'1.0.0-beta.1': '2026-07-23T05:43:21.000Z'},
    versions: {
      '0.23.2': {engines: {node: '>=20'}},
      '1.0.0-beta.1': {engines: {node: '>=20'}, peerDependencies: {typescript: '^5 || ^6 || ^7'}},
    },
  }
  const result = judgeUpgrade({
    dependency,
    current: '0.23.2',
    candidate: {channel: 'beta', version: '1.0.0-beta.1'},
    packument,
    signals: [{reason: 'autoExternal migration', files: ['packages/emp-share/rslib.config.ts']}],
    cooldownHours: 48,
    now,
  })
  assert.equal(result.decision, 'MANUAL_REVIEW')
  assert.equal(result.delta, 'major')
  assert.match(result.reasons.join('\n'), /预发布版本/)
  assert.match(result.reasons.join('\n'), /迁移相关配置/)
})

test('defers a fresh compatible patch until the cooldown expires', () => {
  const packument = {
    time: {'2.1.8': '2026-08-05T07:00:00.000Z'},
    versions: {'2.1.5': {}, '2.1.8': {}},
  }
  const result = judgeUpgrade({
    dependency: {name: '@rspack/core', tier: 'critical'},
    current: '2.1.5',
    candidate: {channel: 'latest', version: '2.1.8', stable: true},
    packument,
    cooldownHours: 48,
    now,
  })
  assert.equal(result.decision, 'DEFER_COOLDOWN')
})

test('renders a decision table suitable for automation reports', () => {
  const markdown = renderMarkdown({
    checkedAt: now.toISOString(),
    results: [
      {
        name: '@rslib/core',
        current: '0.23.2',
        stable: '0.23.2',
        candidate: {channel: 'beta', version: '1.0.0-beta.1'},
        delta: 'major',
        signals: [{files: ['rslib.config.ts']}],
        decision: 'MANUAL_REVIEW',
        reasons: ['预发布版本'],
      },
    ],
  })
  assert.match(markdown, /\| @rslib\/core \| 0\.23\.2 \| 0\.23\.2 \| 1\.0\.0-beta\.1 \(beta\)/)
})
