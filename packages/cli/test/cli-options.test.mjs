import assert from 'node:assert/strict'
import path from 'node:path'
import {createJiti} from 'jiti'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const jiti = createJiti(import.meta.url)
const options = jiti(path.join(repoRoot, 'packages/cli/src/script/options.ts'))

assert.deepEqual(options.collectEnvVar('API_URL=https://example.com', {}), {
  API_URL: 'https://example.com',
})

assert.throws(
  () => options.collectEnvVar('BROKEN', {}),
  /--env-vars 参数必须使用 key=value 格式/,
)

assert.equal(options.parseBooleanOption(undefined, true), true)
assert.equal(options.parseBooleanOption('false', true), false)
assert.equal(options.parseBooleanOption('0', true), false)
assert.equal(options.parseBooleanOption('true', false), true)

assert.deepEqual(
  options.normalizeCliOptions({
    clearLog: 'false',
    envVars: {A: '1'},
    hot: true,
  }),
  {
    clearLog: false,
    envVars: {A: '1'},
    hot: true,
  },
)
