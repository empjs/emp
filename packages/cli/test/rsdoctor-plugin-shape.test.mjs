import assert from 'node:assert/strict'
import {execFile as execFileCallback} from 'node:child_process'
import {mkdir, mkdtemp, rm, stat, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {promisify} from 'node:util'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const execFile = promisify(execFileCallback)

const createFixture = async (name, config = {}) => {
  const root = await mkdtemp(path.join(tmpdir(), `emp-rsdoctor-${name}-`))
  await mkdir(path.join(root, 'src'), {recursive: true})
  await writeFile(path.join(root, 'package.json'), JSON.stringify({name, private: true, version: '0.0.0'}, null, 2))
  await writeFile(path.join(root, 'src/index.ts'), "export const fixtureValue = 'ok'\n")
  await writeFile(
    path.join(root, 'emp.config.ts'),
    `export default ${JSON.stringify({appSrc: 'src', appEntry: 'index.ts', ...config}, null, 2)}\n`,
  )
  return root
}

const loadRsdoctorShape = async (fixtureRoot, setupOptions = {doctor: true}) => {
  const script = `
    process.chdir(${JSON.stringify(fixtureRoot)})
    process.env.NODE_ENV = ''
    process.env.ENV = ''
    const {store} = await import(${JSON.stringify(`file://${path.join(repoRoot, 'packages/cli/dist/index.js')}`)})
    await store.setup('build', ${JSON.stringify(setupOptions)})
    const plugins = store.rsConfig.plugins ?? []
    const pluginNames = plugins.map(plugin => plugin?.constructor?.name ?? plugin?.name ?? '')
    const doctorPlugin = plugins.find(plugin => String(plugin?.constructor?.name ?? '').toLowerCase().includes('doctor'))
    console.log('__EMP_JSON__' + JSON.stringify({
      pluginNames,
      doctorOptions: doctorPlugin ? {
        disableClientServer: doctorPlugin.options?.disableClientServer,
        reportDir: doctorPlugin.options?.output?.reportDir,
      } : null,
    }))
  `
  const {stdout} = await execFile(process.execPath, ['--input-type=module', '--eval', script], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024 * 10,
  })
  const jsonStart = stdout.indexOf('__EMP_JSON__')
  assert.notEqual(jsonStart, -1, stdout)
  return JSON.parse(stdout.slice(jsonStart + '__EMP_JSON__'.length).trim())
}

const doctorFlagFixture = await createFixture('plugin-shape')
const configuredFixture = await createFixture('configured-options', {
  debug: {
    rsdoctor: {
      disableClientServer: true,
      output: {reportDir: 'custom-rsdoctor-report'},
    },
  },
})

try {
  const shape = await loadRsdoctorShape(doctorFlagFixture)
  assert.ok(
    shape.pluginNames.some(name => name.toLowerCase().includes('doctor')),
    `expected Rsdoctor plugin in Rspack plugins, got: ${shape.pluginNames.join(', ')}`,
  )

  const configuredShape = await loadRsdoctorShape(configuredFixture, {doctor: false})
  assert.ok(
    configuredShape.pluginNames.some(name => name.toLowerCase().includes('doctor')),
    `expected debug.rsdoctor config to enable the plugin, got: ${configuredShape.pluginNames.join(', ')}`,
  )
  assert.equal(configuredShape.doctorOptions?.disableClientServer, true)
  assert.equal(configuredShape.doctorOptions?.reportDir, 'custom-rsdoctor-report')

  const {stdout, stderr} = await execFile(
    process.execPath,
    [path.join(repoRoot, 'packages/cli/bin/emp.js'), 'build', '--env', 'prod', '--clearLog', 'false'],
    {cwd: configuredFixture, env: {...process.env, NODE_ENV: '', ENV: ''}, maxBuffer: 1024 * 1024 * 10},
  )
  assert.match(`${stdout}\n${stderr}`, /Rsdoctor v1\.6\.1/)
  const reportManifest = await stat(path.join(configuredFixture, 'custom-rsdoctor-report/.rsdoctor/manifest.json'))
  assert.ok(reportManifest.isFile() && reportManifest.size > 0, 'expected Rsdoctor report manifest')
} finally {
  await Promise.all([
    rm(doctorFlagFixture, {recursive: true, force: true}),
    rm(configuredFixture, {recursive: true, force: true}),
  ])
}
