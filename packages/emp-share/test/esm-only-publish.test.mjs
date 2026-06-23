import assert from 'node:assert/strict'
import {readdirSync, readFileSync} from 'node:fs'
import {join} from 'node:path'

const packageJson = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'))
const packageRoot = new URL('..', import.meta.url)

function collectExportIssues(value, path = 'exports') {
  if (!value || typeof value !== 'object') return []

  const issues = []
  for (const [key, nestedValue] of Object.entries(value)) {
    const nextPath = `${path}.${key}`
    if (key === 'require') {
      issues.push(`${nextPath} should not exist in an ESM-only package`)
      continue
    }
    if (typeof nestedValue === 'string' && (nestedValue.endsWith('.cjs') || nestedValue.endsWith('.d.cts'))) {
      issues.push(`${nextPath} points to CJS output: ${nestedValue}`)
      continue
    }
    issues.push(...collectExportIssues(nestedValue, nextPath))
  }
  return issues
}

function listFiles(dir) {
  return readdirSync(new URL(dir, packageRoot), {recursive: true, withFileTypes: true})
    .filter(entry => entry.isFile())
    .map(entry => join(entry.parentPath, entry.name))
}

const exportIssues = collectExportIssues(packageJson.exports)
assert.deepEqual(exportIssues, [], exportIssues.join('\n'))

for (const [subpath, exportValue] of Object.entries(packageJson.exports)) {
  assert.equal(typeof exportValue, 'object', `${subpath} export should be an object`)
  assert.equal(typeof exportValue.types, 'string', `${subpath} export should declare types`)

  if (subpath === './library') {
    assert.equal(exportValue.default, './output/sdk.js')
    continue
  }

  assert.equal(typeof exportValue.import, 'string', `${subpath} export should declare import`)
  assert.equal(typeof exportValue.default, 'string', `${subpath} export should declare default`)
  assert.equal(exportValue.import, exportValue.default, `${subpath} import/default should point to the same ESM file`)
  assert.ok(exportValue.types.endsWith('.d.ts'), `${subpath} types should point to .d.ts`)
  assert.ok(exportValue.import.endsWith('.js'), `${subpath} import should point to .js`)
}

const cjsArtifacts = listFiles('dist')
  .filter(file => file.endsWith('.cjs') || file.endsWith('.cjs.map') || file.endsWith('.d.cts'))
  .map(file => file.replace(`${new URL('.', packageRoot).pathname}`, ''))

assert.deepEqual(cjsArtifacts, [], `unexpected CJS artifacts:\n${cjsArtifacts.join('\n')}`)
