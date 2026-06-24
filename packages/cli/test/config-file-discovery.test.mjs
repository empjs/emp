import assert from 'node:assert/strict'
import {mkdtemp, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {createJiti} from 'jiti'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const jiti = createJiti(import.meta.url, {
  alias: {
    src: path.join(repoRoot, 'packages/cli/src'),
  },
})
const loadConfig = jiti(path.join(repoRoot, 'packages/cli/src/helper/loadConfig.ts'))

assert.ok(loadConfig.DEFAULT_CONFIG_FILES.includes('emp-config.ts'))
assert.ok(loadConfig.DEFAULT_CONFIG_FILES.includes('emp.config.cts'))

const root = await mkdtemp(path.join(tmpdir(), 'emp-config-discovery-'))
await writeFile(path.join(root, 'emp-config.js'), 'export default {}\n')

const candidates = loadConfig.getEmpConfigCandidatePaths(root)
assert.equal(candidates[0], path.join(root, 'emp-config.ts'))
assert.ok(candidates.includes(path.join(root, 'emp-config.js')))
