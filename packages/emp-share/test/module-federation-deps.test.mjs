import assert from 'node:assert/strict'
import {readFileSync} from 'node:fs'

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))

const expectedVersion = '^2.7.0'
const expectedDeps = [
  '@module-federation/rspack',
  '@module-federation/runtime',
  '@module-federation/runtime-tools',
  '@module-federation/sdk',
]

for (const dep of expectedDeps) {
  assert.equal(
    packageJson.dependencies?.[dep],
    expectedVersion,
    `${dep} should stay on the Module Federation ${expectedVersion} line`,
  )
}
