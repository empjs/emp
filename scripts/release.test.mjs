import assert from 'node:assert/strict'
import {execFile as execFileCallback} from 'node:child_process'
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {dirname, join} from 'node:path'
import test from 'node:test'
import {promisify} from 'node:util'
import {fileURLToPath} from 'node:url'
import {
  applyInternalVersion,
  buildPublishCommands,
  createReleasePlan,
  prependChangelog,
  renderChangelogEntry,
  validateReleasePlan,
} from './release-core.mjs'

const execFile = promisify(execFileCallback)
const releaseCli = fileURLToPath(new URL('./release.mjs', import.meta.url))
const repoRoot = dirname(dirname(fileURLToPath(import.meta.url)))

const createFixture = async () => {
  const root = await mkdtemp(join(tmpdir(), 'emp-release-'))

  const writeJson = async (file, value) => {
    await mkdir(join(root, file, '..'), {recursive: true})
    await writeFile(join(root, file), `${JSON.stringify(value, null, 2)}\n`)
  }

  await writeJson('package.json', {
    name: 'emp-workspace',
    version: '4.0.0',
    private: true,
    engines: {node: '^20.19.0 || >=22.12.0', pnpm: '10.x'},
    packageManager: 'pnpm@10.33.0',
  })
  await writeFile(
    join(root, 'pnpm-workspace.yaml'),
    "packages:\n  - packages/**\n  - projects/**\n  - website\n",
  )
  await writeJson('packages/cli/package.json', {
    name: '@empjs/cli',
    version: '4.0.0',
    publishConfig: {access: 'public'},
    dependencies: {'@empjs/chain': 'workspace:*'},
  })
  await writeJson('packages/emp-chain/package.json', {
    name: '@empjs/chain',
    version: '4.0.0',
    publishConfig: {access: 'public'},
  })
  await writeJson('packages/plugin-react/package.json', {
    name: '@empjs/plugin-react',
    version: '4.0.0',
    publishConfig: {access: 'public'},
    devDependencies: {'@empjs/cli': 'workspace:*'},
  })
  await writeJson('packages/cdn-react-19/package.json', {
    name: '@empjs/cdn-react',
    version: '0.19.2',
    publishConfig: {access: 'public'},
  })
  await writeJson('packages/lib-react-17/package.json', {
    name: '@empjs/lib-react',
    version: '0.17.0',
    publishConfig: {access: 'public'},
  })
  await writeJson('projects/demo/package.json', {
    name: 'demo',
    version: '1.0.0',
  })
  await writeJson('website/package.json', {
    name: '@empjs/offical',
    version: '1.0.0',
    private: true,
  })

  return root
}

const withFixture = async (fn) => {
  const root = await createFixture()
  try {
    return await fn(root)
  } finally {
    await rm(root, {recursive: true, force: true})
  }
}

test('createReleasePlan scopes internal release packages to core packages only', async () => {
  await withFixture(async (root) => {
    const plan = await createReleasePlan(root)

    assert.deepEqual(
      plan.internalPackages.map((pkg) => pkg.name),
      ['@empjs/chain', '@empjs/cli', '@empjs/plugin-react'],
    )
    assert.deepEqual(
      plan.independentPackages.map((pkg) => pkg.name),
      ['@empjs/cdn-react', '@empjs/lib-react'],
    )
    assert.equal(plan.workspacePackages.some((pkg) => pkg.dir.startsWith('projects/')), true)
    assert.equal(plan.internalPackages.some((pkg) => pkg.dir.startsWith('projects/')), false)
    assert.equal(plan.internalPackages.some((pkg) => pkg.dir === 'website'), false)
    assert.deepEqual(validateReleasePlan(plan), [])
  })
})

test('validateReleasePlan reports version drift for internal packages', async () => {
  await withFixture(async (root) => {
    const cliPath = join(root, 'packages/cli/package.json')
    const cliPkg = JSON.parse(await readFile(cliPath, 'utf8'))
    cliPkg.version = '4.0.1'
    await writeFile(cliPath, `${JSON.stringify(cliPkg, null, 2)}\n`)

    const plan = await createReleasePlan(root)
    assert.deepEqual(validateReleasePlan(plan), [
      'packages/cli/package.json version 4.0.1 does not match root version 4.0.0',
    ])
  })
})

test('validateReleasePlan reports package manager baseline drift', async () => {
  await withFixture(async (root) => {
    const rootPath = join(root, 'package.json')
    const rootPkg = JSON.parse(await readFile(rootPath, 'utf8'))
    rootPkg.engines.node = '>=18.0.0'
    await writeFile(rootPath, `${JSON.stringify(rootPkg, null, 2)}\n`)

    const plan = await createReleasePlan(root)
    assert.deepEqual(validateReleasePlan(plan), [
      'root engines.node must be ^20.19.0 || >=22.12.0, got >=18.0.0',
    ])
  })
})

test('applyInternalVersion updates root and internal packages without touching independent packages', async () => {
  await withFixture(async (root) => {
    const plan = await createReleasePlan(root)
    await applyInternalVersion(plan, '4.1.0-internal.0')

    const rootPkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
    const cliPkg = JSON.parse(await readFile(join(root, 'packages/cli/package.json'), 'utf8'))
    const cdnPkg = JSON.parse(await readFile(join(root, 'packages/cdn-react-19/package.json'), 'utf8'))
    const demoPkg = JSON.parse(await readFile(join(root, 'projects/demo/package.json'), 'utf8'))

    assert.equal(rootPkg.version, '4.1.0-internal.0')
    assert.equal(cliPkg.version, '4.1.0-internal.0')
    assert.equal(cdnPkg.version, '0.19.2')
    assert.equal(demoPkg.version, '1.0.0')
  })
})

test('renderChangelogEntry and prependChangelog create a concise release-notes entry', async () => {
  await withFixture(async (root) => {
    const plan = await createReleasePlan(root)
    const entry = renderChangelogEntry(plan, {
      version: '4.0.0',
      date: '2026-06-23',
      tag: 'internal',
      registry: 'https://npm.internal.example/',
    })

    assert.match(entry, /## 4\.0\.0 - 2026-06-23/)
    assert.match(entry, /### Highlights/)
    assert.match(entry, /### What's Changed/)
    assert.match(entry, /#### Build/)
    assert.match(entry, /dist-tag `internal`/)
    assert.match(entry, /core `@empjs\/\*` packages/)
    assert.doesNotMatch(entry, /发布包范围/)
    assert.doesNotMatch(entry, /自动化验证/)
    assert.doesNotMatch(entry, /@empjs\/cli/)
    assert.doesNotMatch(entry, /@empjs\/cdn-react/)
    assert.doesNotMatch(entry, /projects\/demo/)
    assert.doesNotMatch(entry, /TODO|TBD/)

    await prependChangelog(root, entry)
    const changelog = await readFile(join(root, 'CHANGELOG.md'), 'utf8')
    assert.match(changelog, /^# Changelog\n\n## 4\.0\.0 - 2026-06-23/)
  })
})

test('buildPublishCommands dry-runs with pnpm and publishes packed tarballs with npm', async () => {
  await withFixture(async (root) => {
    const plan = await createReleasePlan(root)
    const dryRunCommands = buildPublishCommands(plan, {
      dryRun: true,
      tag: 'internal',
      registry: 'https://npm.internal.example/',
    })
    const defaultCommands = buildPublishCommands(plan, {dryRun: true})

    assert.equal(defaultCommands.some((command) => command.includes('alpha')), true)

    assert.equal(dryRunCommands.length, 3)
    for (const command of dryRunCommands) {
      assert.equal(command[0], 'pnpm')
      assert.equal(command.includes('--filter'), true)
      assert.equal(command.includes('--dir'), false)
      assert.equal(command.includes('--dry-run'), true)
      assert.equal(command.includes('--no-git-checks'), true)
      assert.equal(command.includes('--tag'), true)
      assert.equal(command.includes('internal'), true)
      assert.equal(command.includes('https://npm.internal.example/'), true)
      assert.equal(command.some((part) => part.includes('projects/')), false)
      assert.equal(command.some((part) => part.includes('website')), false)
      assert.equal(command.some((part) => part.includes('cdn-react')), false)
      assert.equal(command.some((part) => part.includes('lib-react')), false)
    }

    assert.throws(
      () => buildPublishCommands(plan, {dryRun: false, tag: 'internal'}),
      /Real publish requires yes: true/,
    )

    const publishCommands = buildPublishCommands(plan, {dryRun: false, yes: true, tag: 'internal'})
    assert.equal(publishCommands.length, 6)
    assert.deepEqual(publishCommands[0].slice(0, 4), ['pnpm', '--filter', '@empjs/chain', 'pack'])
    assert.equal(publishCommands[0].includes('--out'), true)
    assert.match(publishCommands[0].at(-1), /empjs-chain-4\.0\.0\.tgz$/)
    assert.deepEqual(publishCommands[1].slice(0, 2), ['npm', 'publish'])
    assert.match(publishCommands[1][2], /empjs-chain-4\.0\.0\.tgz$/)
    assert.equal(publishCommands[1].includes('--tag'), true)
    assert.equal(publishCommands[1].includes('internal'), true)
    assert.equal(publishCommands[1].includes('--access'), true)
    assert.equal(publishCommands[1].includes('public'), true)
    assert.equal(publishCommands[1].includes('--dry-run'), false)
    assert.equal(publishCommands.some((command) => command[0] === 'pnpm' && command.includes('publish')), false)

    const cliCommands = buildPublishCommands(plan, {
      dryRun: false,
      yes: true,
      tag: 'alpha',
      packageName: '@empjs/cli',
    })
    assert.equal(cliCommands.length, 2)
    assert.deepEqual(cliCommands[0].slice(0, 4), ['pnpm', '--filter', '@empjs/cli', 'pack'])
    assert.match(cliCommands[0].at(-1), /empjs-cli-4\.0\.0\.tgz$/)
    assert.deepEqual(cliCommands[1].slice(0, 3), ['npm', 'publish', cliCommands[0].at(-1)])
    assert.equal(cliCommands[1].includes('alpha'), true)
  })
})

test('release CLI check prints scoped package summary', async () => {
  await withFixture(async (root) => {
    const {stdout} = await execFile(process.execPath, [releaseCli, 'check', '--root', root])

    assert.match(stdout, /Internal packages: 3/)
    assert.match(stdout, /Independent packages: 2/)
    assert.match(stdout, /Workspace packages: 2/)
    assert.match(stdout, /@empjs\/cli/)
    assert.doesNotMatch(stdout, /projects\/demo/)
  })
})

test('trusted publisher workflow uses publish.yml and alpha release automation', async () => {
  const workflow = await readFile(join(repoRoot, '.github/workflows/publish.yml'), 'utf8')

  assert.match(workflow, /name:\s*Publish/)
  assert.match(workflow, /id-token:\s*write/)
  assert.match(workflow, /node-version:\s*['"]?24/)
  assert.match(workflow, /tags:\n\s+- ['"]empjs-\*-v\*['"]/)
  assert.match(workflow, /tag="[^"]*\$\{GITHUB_REF_NAME\}"/)
  assert.match(workflow, /RELEASE_PACKAGE=@empjs\/\$package_name/)
  assert.match(workflow, /default:\s*['"]{2}/)
  assert.match(workflow, /corepack prepare pnpm@10\.33\.0 --activate/)
  assert.match(workflow, /args=\(--yes --skip-build\)/)
  assert.match(workflow, /args\+=\(--package "\$RELEASE_PACKAGE"\)/)
  assert.match(workflow, /pnpm release:publish -- "\$\{args\[@\]\}"/)
  assert.doesNotMatch(workflow, /\|\| ['"]@empjs\/cli['"]/)
  assert.doesNotMatch(workflow, /NPM_TOKEN/)
  assert.doesNotMatch(workflow, /publish-alpha\.yml/)
})
