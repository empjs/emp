import assert from 'node:assert/strict'
import {execFile as execFileCallback} from 'node:child_process'
import {mkdir, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import path from 'node:path'
import {promisify} from 'node:util'

const repoRoot = path.resolve(import.meta.dirname, '../../..')
const execFile = promisify(execFileCallback)

const createFixture = async (name, empConfig) => {
  const root = path.join(tmpdir(), `emp-${name}-${process.pid}`)
  await mkdir(path.join(root, 'src'), {recursive: true})
  await writeFile(path.join(root, 'package.json'), JSON.stringify({name, private: true, version: '0.0.0'}, null, 2))
  await writeFile(path.join(root, 'src/index.ts'), "export const fixtureValue = 'ok'\n")
  await writeFile(path.join(root, 'emp.config.ts'), `export default ${JSON.stringify(empConfig, null, 2)}\n`)
  return root
}

const loadStoreForFixture = async (fixtureRoot) => {
  const script = `
    process.chdir(${JSON.stringify(fixtureRoot)})
    process.env.NODE_ENV = ''
    process.env.ENV = ''
    const {store} = await import(${JSON.stringify(`file://${path.join(repoRoot, 'packages/cli/dist/index.js')}`)})
    await store.setup('dev', {})
    const plugins = store.rsConfig.plugins ?? []
    const pluginNames = plugins.map(plugin => plugin?.constructor?.name ?? plugin?.name ?? '')
    const circularCheckPlugin = plugins.find(plugin => plugin?.constructor?.name === 'CircularCheckRspackPlugin')
    console.log(
      '__EMP_JSON__' +
        JSON.stringify({
          ...store.rsConfig,
          __pluginNames: pluginNames,
          __circularCheckOptions: circularCheckPlugin?._options ?? null,
        }),
    )
  `
  const {stdout} = await execFile(process.execPath, ['--input-type=module', '--eval', script], {
    cwd: repoRoot,
    maxBuffer: 1024 * 1024 * 10,
  })
  const jsonStart = stdout.indexOf('__EMP_JSON__')
  assert.notEqual(jsonStart, -1, stdout)
  return JSON.parse(stdout.slice(jsonStart + '__EMP_JSON__'.length).trim())
}

{
  const config = await loadStoreForFixture(
    await createFixture('rspack-default-config', {
      appSrc: 'src',
      appEntry: 'index.ts',
    }),
  )

  assert.equal(config.experiments?.css, undefined)
  assert.ok(Object.hasOwn(config, 'incremental'))
  assert.ok(Object.hasOwn(config, 'lazyCompilation'))
  assert.ok(!config.__pluginNames.includes('CircularCheckRspackPlugin'))
  assert.equal(config.__circularCheckOptions, null)
}

{
  const config = await loadStoreForFixture(
    await createFixture('rspack-dev-flags', {
      appSrc: 'src',
      appEntry: 'index.ts',
      build: {
        incremental: false,
        lazyCompilation: false,
      },
      debug: {
        nativeWatcher: false,
      },
    }),
  )

  assert.equal(config.experiments?.nativeWatcher, false)
  assert.equal(config.incremental, false)
  assert.equal(config.lazyCompilation, false)
}

{
  const config = await loadStoreForFixture(
    await createFixture('rspack-circular-check', {
      appSrc: 'src',
      appEntry: 'index.ts',
      circularCheckRspackPlugin: {
        failOnError: true,
      },
    }),
  )

  assert.ok(
    config.__pluginNames.includes('CircularCheckRspackPlugin'),
    `expected CircularCheckRspackPlugin in plugins, got: ${config.__pluginNames.join(', ')}`,
  )
  assert.deepEqual(config.__circularCheckOptions, {failOnError: true})
}
