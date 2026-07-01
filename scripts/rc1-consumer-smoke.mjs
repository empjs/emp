#!/usr/bin/env node
import {execFile as execFileCallback} from 'node:child_process'
import {mkdtemp, mkdir, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {fileURLToPath} from 'node:url'
import {promisify} from 'node:util'

const execFile = promisify(execFileCallback)
const repoRoot = fileURLToPath(new URL('..', import.meta.url))
const packageNames = ['@empjs/chain', '@empjs/cli', '@empjs/plugin-react', '@empjs/share']
const dependencyFields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']

const quote = (part) => (/[\s"'$]/.test(part) ? JSON.stringify(part) : part)
const commandText = (command, args) => [command, ...args].map(quote).join(' ')
const tarballName = (packageName) => `${packageName.replace(/^@/, '').replace(/\//g, '-')}-4.0.0-rc.1.tgz`

async function run(command, args, options = {}) {
  const cwd = options.cwd ?? repoRoot
  console.log(`$ ${commandText(command, args)}`)
  try {
    return await execFile(command, args, {
      cwd,
      env: {...process.env, FORCE_COLOR: '0'},
      maxBuffer: 1024 * 1024 * 30,
      timeout: options.timeout ?? 240000,
    })
  } catch (error) {
    const stdout = error.stdout ? `\nstdout:\n${error.stdout}` : ''
    const stderr = error.stderr ? `\nstderr:\n${error.stderr}` : ''
    throw new Error(`${commandText(command, args)} failed${stdout}${stderr}`)
  }
}

async function readPackedManifest(tarballPath) {
  const {stdout} = await run('tar', ['-xOf', tarballPath, 'package/package.json'])
  return JSON.parse(stdout)
}

function assertNoWorkspaceRanges(manifest, tarballPath) {
  const issues = []
  for (const field of dependencyFields) {
    const dependencies = manifest[field] ?? {}
    for (const [name, range] of Object.entries(dependencies)) {
      if (String(range).startsWith('workspace:')) {
        issues.push(`${field}.${name}=${range}`)
      }
    }
  }

  if (issues.length > 0) {
    throw new Error(`${tarballPath} still contains workspace ranges:\n${issues.join('\n')}`)
  }
}

async function writeConsumerSmoke(consumerRoot, tarballByPackage) {
  const localDependencies = Object.fromEntries(
    packageNames.map((packageName) => [packageName, `file:${tarballByPackage.get(packageName)}`]),
  )
  await writeFile(
    join(consumerRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'emp-rc1-consumer-smoke',
        private: true,
        type: 'module',
        dependencies: localDependencies,
        pnpm: {
          overrides: localDependencies,
        },
      },
      null,
      2,
    )}\n`,
  )
  await writeFile(
    join(consumerRoot, 'smoke.mjs'),
    [
      "import assert from 'node:assert/strict'",
      "import ChainConfig from '@empjs/chain'",
      "import empSharePlugin from '@empjs/share'",
      "import * as mfRuntime from '@empjs/share/mfRuntime'",
      "import * as shareRspack from '@empjs/share/rspack'",
      "import pluginReact from '@empjs/plugin-react'",
      '',
      "assert.equal(typeof ChainConfig, 'function')",
      "assert.equal(typeof empSharePlugin, 'function')",
      "assert.equal(typeof mfRuntime.createInstance, 'function')",
      "assert.equal(typeof shareRspack.default, 'function')",
      "assert.equal(typeof pluginReact, 'function')",
      "console.log('consumer imports ok')",
      '',
    ].join('\n'),
  )
}

async function main() {
  const tempRoot = await mkdtemp(join(tmpdir(), 'emp-rc1-consumer-'))
  const packDir = join(tempRoot, 'packs')
  const consumerRoot = join(tempRoot, 'consumer')
  const keepTemp = process.env.EMP_KEEP_RC1_SMOKE === '1'

  try {
    await mkdir(packDir, {recursive: true})
    await mkdir(consumerRoot, {recursive: true})

    for (const packageName of packageNames) {
      await run('corepack', ['pnpm@10.33.0', '--filter', packageName, 'build'])
    }

    const tarballByPackage = new Map()
    for (const packageName of packageNames) {
      const tarballPath = join(packDir, tarballName(packageName))
      await run('corepack', ['pnpm@10.33.0', '--filter', packageName, 'pack', '--out', tarballPath])
      const manifest = await readPackedManifest(tarballPath)
      assertNoWorkspaceRanges(manifest, tarballPath)
      tarballByPackage.set(packageName, tarballPath)
    }

    await writeConsumerSmoke(consumerRoot, tarballByPackage)
    await run('corepack', ['pnpm@10.33.0', 'install'], {cwd: consumerRoot})
    await run(process.execPath, ['smoke.mjs'], {cwd: consumerRoot})

    const cliBin = join(consumerRoot, 'node_modules/@empjs/cli/bin/emp.js')
    const help = await run(process.execPath, [cliBin, '--help'], {cwd: consumerRoot})
    if (!/Usage|emp/i.test(`${help.stdout}\n${help.stderr}`)) {
      throw new Error('emp --help did not print CLI help text')
    }

    console.log('rc1 consumer smoke passed')
  } finally {
    if (keepTemp) {
      console.log(`EMP_KEEP_RC1_SMOKE=1, kept ${tempRoot}`)
    } else {
      await rm(tempRoot, {recursive: true, force: true})
    }
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
