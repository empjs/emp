import assert from 'node:assert/strict'
import {execFile as execFileCallback} from 'node:child_process'
import {mkdir, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {promisify} from 'node:util'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const execFile = promisify(execFileCallback)

const createFixture = async name => {
  const root = path.join(tmpdir(), `emp-rsdoctor-${name}-${process.pid}`)
  await mkdir(path.join(root, 'src'), {recursive: true})
  await writeFile(path.join(root, 'package.json'), JSON.stringify({name, private: true, version: '0.0.0'}, null, 2))
  await writeFile(path.join(root, 'src/index.ts'), "export const fixtureValue = 'ok'\n")
  await writeFile(
    path.join(root, 'emp.config.ts'),
    `export default ${JSON.stringify({appSrc: 'src', appEntry: 'index.ts'}, null, 2)}\n`,
  )
  return root
}

const loadRsdoctorShape = async fixtureRoot => {
  const script = `
    process.chdir(${JSON.stringify(fixtureRoot)})
    process.env.NODE_ENV = ''
    process.env.ENV = ''
    const {store} = await import(${JSON.stringify(`file://${path.join(repoRoot, 'packages/cli/dist/index.js')}`)})
    await store.setup('build', {doctor: true})
    const pluginNames = (store.rsConfig.plugins ?? []).map(plugin => plugin?.constructor?.name ?? plugin?.name ?? '')
    console.log('__EMP_JSON__' + JSON.stringify({pluginNames}))
  `
  const {stdout} = await execFile(process.execPath, ['--input-type=module', '--eval', script], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024 * 10,
  })
  const jsonStart = stdout.indexOf('__EMP_JSON__')
  assert.notEqual(jsonStart, -1, stdout)
  return JSON.parse(stdout.slice(jsonStart + '__EMP_JSON__'.length).trim())
}

const shape = await loadRsdoctorShape(await createFixture('plugin-shape'))
assert.ok(
  shape.pluginNames.some(name => name.toLowerCase().includes('doctor')),
  `expected Rsdoctor plugin in Rspack plugins, got: ${shape.pluginNames.join(', ')}`,
)
