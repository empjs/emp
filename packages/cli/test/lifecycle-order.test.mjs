import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import path from 'node:path'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const pluginSource = await readFile(path.join(repoRoot, 'packages/cli/src/store/rspack/plugin.ts'), 'utf8')
const baseSource = await readFile(path.join(repoRoot, 'packages/cli/src/script/base.ts'), 'utf8')
const devSource = await readFile(path.join(repoRoot, 'packages/cli/src/script/dev.ts'), 'utf8')

assert.ok(pluginSource.indexOf('await this.store.empConfig.lifeCycle.beforePlugin()') < pluginSource.indexOf('await this.define()'))
assert.match(baseSource, /protected addCloseHook/)
assert.match(baseSource, /protected async executeCloseHooks/)
assert.match(baseSource, /process\.once\('SIGINT'/)
assert.doesNotMatch(devSource, /private executeCloseHooks\(\)/)
assert.match(devSource, /this\.addCloseHook\(\(\) => configWatcher\.close\(\)\)/)
