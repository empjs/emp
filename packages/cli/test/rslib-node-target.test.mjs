import assert from 'node:assert/strict'
import {readFile} from 'node:fs/promises'
import path from 'node:path'

const repoRoot = path.resolve(import.meta.dirname, '../../..')

const rootPkg = JSON.parse(await readFile(path.join(repoRoot, 'package.json'), 'utf8'))
const rslibConfig = await readFile(path.join(repoRoot, 'packages/cli/rslib.config.ts'), 'utf8')

assert.equal(rootPkg.engines.node, '^20.19.0 || >=22.12.0')
assert.match(rslibConfig, /node\s+>=\s+20\.19\.0/)
assert.doesNotMatch(rslibConfig, /node\s+>=\s+22\.12\.0/)
