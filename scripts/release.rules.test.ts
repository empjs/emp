import {describe, expect, test} from '@rstest/core'
import {execFile as execFileCallback} from 'node:child_process'
import {mkdtemp, mkdir, readFile, rm, writeFile} from 'node:fs/promises'
import {tmpdir} from 'node:os'
import {join} from 'node:path'
import {promisify} from 'node:util'
import {
  applyInternalVersion,
  buildPublishCommands,
  createReleasePlan,
  prependChangelog,
  renderChangelogEntry,
  validateReleasePlan,
} from './release-core.mjs'

const execFile = promisify(execFileCallback)
const repoRoot = process.cwd()
const releaseCli = join(repoRoot, 'scripts/release.mjs')

const createFixture = async () => {
  const root = await mkdtemp(join(tmpdir(), 'emp-release-'))

  const writeJson = async (file: string, value: unknown) => {
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
  await writeFile(join(root, 'pnpm-workspace.yaml'), 'packages:\n  - packages/**\n  - apps/**\n  - website\n')
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
  await writeJson('packages/plugin-new/package.json', {
    name: '@empjs/plugin-new',
    version: '4.0.0',
    publishConfig: {access: 'public'},
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
  await writeJson('apps/demo/package.json', {
    name: 'demo',
    version: '1.0.0',
  })
  await writeJson('apps/fake/package.json', {
    name: '@empjs/fake-app',
    version: '1.0.0',
  })
  await writeJson('website/package.json', {
    name: '@empjs/offical',
    version: '1.0.0',
    private: true,
  })

  return root
}

const withFixture = async (fn: (root: string) => Promise<void>) => {
  const root = await createFixture()
  try {
    await fn(root)
  } finally {
    await rm(root, {recursive: true, force: true})
  }
}

describe('release rules', () => {
  test('createReleasePlan scopes internal release packages to core packages only', async () => {
    await withFixture(async root => {
      const plan = await createReleasePlan(root)

      expect(plan.internalPackages.map(pkg => pkg.name)).toEqual([
        '@empjs/chain',
        '@empjs/cli',
        '@empjs/plugin-react',
      ])
      expect(plan.independentPackages.map(pkg => pkg.name)).toEqual(['@empjs/cdn-react', '@empjs/lib-react'])
      expect(plan.workspacePackages.some(pkg => pkg.dir.startsWith('apps/'))).toBe(true)
      expect(plan.internalPackages.some(pkg => pkg.dir.startsWith('apps/'))).toBe(false)
      expect(plan.workspacePackages.some(pkg => pkg.name === '@empjs/fake-app')).toBe(true)
      expect(plan.internalPackages.some(pkg => pkg.name === '@empjs/fake-app')).toBe(false)
      expect(plan.workspacePackages.some(pkg => pkg.name === '@empjs/plugin-new')).toBe(true)
      expect(plan.internalPackages.some(pkg => pkg.name === '@empjs/plugin-new')).toBe(false)
      expect(plan.internalPackages.some(pkg => pkg.dir === 'website')).toBe(false)
      expect(validateReleasePlan(plan)).toEqual([])
    })
  })

  test('validateReleasePlan reports version drift for internal packages', async () => {
    await withFixture(async root => {
      const cliPath = join(root, 'packages/cli/package.json')
      const cliPkg = JSON.parse(await readFile(cliPath, 'utf8'))
      cliPkg.version = '4.0.1'
      await writeFile(cliPath, `${JSON.stringify(cliPkg, null, 2)}\n`)

      const plan = await createReleasePlan(root)
      expect(validateReleasePlan(plan)).toEqual([
        'packages/cli/package.json version 4.0.1 does not match root version 4.0.0',
      ])
    })
  })

  test('validateReleasePlan reports package manager baseline drift', async () => {
    await withFixture(async root => {
      const rootPath = join(root, 'package.json')
      const rootPkg = JSON.parse(await readFile(rootPath, 'utf8'))
      rootPkg.engines.node = '>=18.0.0'
      await writeFile(rootPath, `${JSON.stringify(rootPkg, null, 2)}\n`)

      const plan = await createReleasePlan(root)
      expect(validateReleasePlan(plan)).toEqual([
        'root engines.node must be ^20.19.0 || >=22.12.0, got >=18.0.0',
      ])
    })
  })

  test('applyInternalVersion updates root and internal packages without touching independent packages', async () => {
    await withFixture(async root => {
      const plan = await createReleasePlan(root)
      await applyInternalVersion(plan, '4.1.0-internal.0')

      const rootPkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
      const cliPkg = JSON.parse(await readFile(join(root, 'packages/cli/package.json'), 'utf8'))
      const cdnPkg = JSON.parse(await readFile(join(root, 'packages/cdn-react-19/package.json'), 'utf8'))
      const demoPkg = JSON.parse(await readFile(join(root, 'apps/demo/package.json'), 'utf8'))

      expect(rootPkg.version).toBe('4.1.0-internal.0')
      expect(cliPkg.version).toBe('4.1.0-internal.0')
      expect(cdnPkg.version).toBe('0.19.2')
      expect(demoPkg.version).toBe('1.0.0')
    })
  })

  test('renderChangelogEntry and prependChangelog create a concise release-notes entry', async () => {
    await withFixture(async root => {
      const plan = await createReleasePlan(root)
      const entry = renderChangelogEntry(plan, {
        version: '4.0.0',
        date: '2026-06-23',
        tag: 'internal',
        registry: 'https://npm.internal.example/',
      })

      expect(entry).toMatch(/## 4\.0\.0 - 2026-06-23/)
      expect(entry).toMatch(/### Highlights/)
      expect(entry).toMatch(/### What's Changed/)
      expect(entry).toMatch(/#### Build/)
      expect(entry).toMatch(/dist-tag `internal`/)
      expect(entry).toMatch(/core `@empjs\/\*` packages/)
      expect(entry).not.toMatch(/发布包范围/)
      expect(entry).not.toMatch(/自动化验证/)
      expect(entry).not.toMatch(/@empjs\/cli/)
      expect(entry).not.toMatch(/@empjs\/cdn-react/)
      expect(entry).not.toMatch(/apps\/demo/)
      expect(entry).not.toMatch(/TODO|TBD/)

      await prependChangelog(root, entry)
      const changelog = await readFile(join(root, 'CHANGELOG.md'), 'utf8')
      expect(changelog).toMatch(/^# Changelog\n\n## 4\.0\.0 - 2026-06-23/)
    })
  })

  test('buildPublishCommands dry-runs with pnpm and publishes packed tarballs with npm', async () => {
    await withFixture(async root => {
      const plan = await createReleasePlan(root)
      const dryRunCommands = buildPublishCommands(plan, {
        dryRun: true,
        tag: 'internal',
        registry: 'https://npm.internal.example/',
      })
      const defaultCommands = buildPublishCommands(plan, {dryRun: true})

      expect(defaultCommands.some(command => command.includes('beta'))).toBe(true)

      expect(dryRunCommands).toHaveLength(3)
      for (const command of dryRunCommands) {
        expect(command[0]).toBe('pnpm')
        expect(command.includes('--filter')).toBe(true)
        expect(command.includes('--dir')).toBe(false)
        expect(command.includes('--dry-run')).toBe(true)
        expect(command.includes('--no-git-checks')).toBe(true)
        expect(command.includes('--tag')).toBe(true)
        expect(command.includes('internal')).toBe(true)
        expect(command.includes('https://npm.internal.example/')).toBe(true)
        expect(command.some(part => part.includes('apps/'))).toBe(false)
        expect(command.some(part => part.includes('website'))).toBe(false)
        expect(command.some(part => part.includes('cdn-react'))).toBe(false)
        expect(command.some(part => part.includes('lib-react'))).toBe(false)
      }

      expect(() => buildPublishCommands(plan, {dryRun: false, tag: 'internal'})).toThrow(
        /Real publish requires yes: true/,
      )

      const publishCommands = buildPublishCommands(plan, {dryRun: false, yes: true, tag: 'internal'})
      expect(publishCommands).toHaveLength(6)
      expect(publishCommands[0].slice(0, 4)).toEqual(['pnpm', '--filter', '@empjs/chain', 'pack'])
      expect(publishCommands[0].includes('--out')).toBe(true)
      expect(publishCommands[0].at(-1)).toMatch(/empjs-chain-4\.0\.0\.tgz$/)
      expect(publishCommands[1].slice(0, 2)).toEqual(['npm', 'publish'])
      expect(publishCommands[1][2]).toMatch(/empjs-chain-4\.0\.0\.tgz$/)
      expect(publishCommands[1].includes('--tag')).toBe(true)
      expect(publishCommands[1].includes('internal')).toBe(true)
      expect(publishCommands[1].includes('--access')).toBe(true)
      expect(publishCommands[1].includes('public')).toBe(true)
      expect(publishCommands[1].includes('--dry-run')).toBe(false)
      expect(publishCommands.some(command => command[0] === 'pnpm' && command.includes('publish'))).toBe(false)

      const cliCommands = buildPublishCommands(plan, {
        dryRun: false,
        yes: true,
        tag: 'alpha',
        packageName: '@empjs/cli',
      })
      expect(cliCommands).toHaveLength(2)
      expect(cliCommands[0].slice(0, 4)).toEqual(['pnpm', '--filter', '@empjs/cli', 'pack'])
      expect(cliCommands[0].at(-1)).toMatch(/empjs-cli-4\.0\.0\.tgz$/)
      expect(cliCommands[1].slice(0, 3)).toEqual(['npm', 'publish', cliCommands[0].at(-1)])
      expect(cliCommands[1].includes('alpha')).toBe(true)
    })
  })

  test('release CLI check prints scoped package summary', async () => {
    await withFixture(async root => {
      const {stdout} = await execFile(process.execPath, [releaseCli, 'check', '--root', root])

      expect(stdout).toMatch(/Internal packages: 3/)
      expect(stdout).toMatch(/Independent packages: 2/)
      expect(stdout).toMatch(/Workspace packages: 4/)
      expect(stdout).toMatch(/@empjs\/cli/)
      expect(stdout).not.toMatch(/apps\/demo/)
    })
  })

  test('current repository internal release set stays explicitly bounded', async () => {
    const plan = await createReleasePlan(repoRoot)

    expect(plan.internalPackages.map(pkg => pkg.name)).toEqual([
      '@empjs/adapter-react',
      '@empjs/biome-config',
      '@empjs/bridge-react',
      '@empjs/bridge-vue2',
      '@empjs/bridge-vue3',
      '@empjs/chain',
      '@empjs/cli',
      '@empjs/eslint-config-react',
      '@empjs/plugin-lightningcss',
      '@empjs/plugin-postcss',
      '@empjs/plugin-react',
      '@empjs/plugin-stylus',
      '@empjs/plugin-tailwindcss',
      '@empjs/plugin-tailwindcss2',
      '@empjs/plugin-tailwindcss3',
      '@empjs/plugin-vue2',
      '@empjs/plugin-vue3',
      '@empjs/polyfill',
      '@empjs/share',
    ])
    expect(plan.internalPackages).toHaveLength(19)
  })

  test('release CLI defaults to beta and runs pnpm through the pinned package manager', async () => {
    const releaseSource = await readFile(releaseCli, 'utf8')

    expect(releaseSource).toMatch(/tag:\s*process\.env\.RELEASE_TAG \?\? ['"]beta['"]/)
    expect(releaseSource).toMatch(/const resolveCommand/)
    expect(releaseSource).toMatch(/command\[0\] === ['"]pnpm['"]/)
    expect(releaseSource).toMatch(/\['corepack', packageManager, \.\.\.command\.slice\(1\)\]/)
  })

  test('trusted publisher workflow uses publish.yml and beta release automation', async () => {
    const workflow = await readFile(join(repoRoot, '.github/workflows/publish.yml'), 'utf8')

    expect(workflow).toMatch(/name:\s*Publish/)
    expect(workflow).toMatch(/id-token:\s*write/)
    expect(workflow).toMatch(/node-version:\s*['"]?24/)
    expect(workflow).toMatch(/tags:\n\s+- ['"]empjs-\*-v\*['"]/)
    expect(workflow).toMatch(/tag="[^"]*\$\{GITHUB_REF_NAME\}"/)
    expect(workflow).toMatch(/RELEASE_PACKAGE=@empjs\/\$package_name/)
    expect(workflow).toMatch(/default:\s*['"]{2}/)
    expect(workflow).toMatch(/default:\s*['"]beta['"]/)
    expect(workflow).toMatch(/RELEASE_TAG=\$release_tag/)
    expect(workflow).toMatch(/corepack prepare pnpm@10\.33\.0 --activate/)
    expect(workflow).toMatch(/pnpm test:rules/)
    expect(workflow).not.toMatch(/node --test scripts\/release\.test\.mjs/)
    expect(workflow).toMatch(/args=\(--yes --skip-build\)/)
    expect(workflow).toMatch(/args\+=\(--package "\$RELEASE_PACKAGE"\)/)
    expect(workflow).toMatch(/pnpm release:publish:dry -- --tag "\$RELEASE_TAG" "\$\{args\[@\]\}"/)
    expect(workflow).toMatch(/pnpm release:publish -- --tag "\$RELEASE_TAG" "\$\{args\[@\]\}"/)
    expect(workflow).not.toMatch(/\|\| ['"]@empjs\/cli['"]/)
    expect(workflow).not.toMatch(/NPM_TOKEN/)
    expect(workflow).not.toMatch(/publish-alpha\.yml/)
  })
})
