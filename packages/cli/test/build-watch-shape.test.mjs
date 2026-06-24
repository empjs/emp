import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import path from 'node:path'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const buildSource = await readFile(path.join(repoRoot, 'packages/cli/src/script/build.ts'), 'utf8')
const lifecycleSource = await readFile(path.join(repoRoot, 'packages/cli/src/store/lifeCycle.ts'), 'utf8')

assert.match(buildSource, /this\.rspackConfig\.watch = true/)
assert.doesNotMatch(
  buildSource,
  /if \(this\.rspackConfig\.optimization\) \{\s*this\.rspackConfig\.optimization\.moduleIds[\s\S]*this\.rspackConfig\.watch = true\s*\}/,
)
assert.match(buildSource, /process\.exitCode = 1/)
assert.match(buildSource, /await this\.startServe\(\)/)
assert.match(lifecycleSource, /async afterBuild\(\)/)
