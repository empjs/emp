import {constants} from 'node:fs'
import {access, mkdir, readFile, readdir, writeFile} from 'node:fs/promises'
import {dirname, join, relative} from 'node:path'

const INTERNAL_SCOPE = '@empjs/'
const DEFAULT_TAG = 'alpha'
const DEFAULT_ACCESS = 'public'
const REQUIRED_NODE_ENGINE = '^20.19.0 || >=22.12.0'
const PACKAGE_JSON = 'package.json'
const WORKSPACE_ROOTS = ['packages', 'projects', 'website']
const INDEPENDENT_PREFIXES = ['@empjs/cdn-', '@empjs/lib-']

const sortByName = (packages) => [...packages].sort((a, b) => a.name.localeCompare(b.name))

const readJson = async (filePath) => JSON.parse(await readFile(filePath, 'utf8'))

const writeJson = async (filePath, value) => {
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`)
}

const exists = async (filePath) => {
  try {
    await access(filePath, constants.F_OK)
    return true
  } catch {
    return false
  }
}

const toPosixPath = (path) => path.split('\\').join('/')

const tarballFileName = (pkg) => `${pkg.name.replace(/^@/, '').replace(/\//g, '-')}-${pkg.version}.tgz`

const selectInternalPackages = (plan, packageName) => {
  const selectedName = packageName?.trim()
  if (!selectedName) return plan.internalPackages

  const selectedPackages = plan.internalPackages.filter((pkg) => pkg.name === selectedName)
  if (!selectedPackages.length) {
    throw new Error(`${selectedName} is not in the internal release set`)
  }

  return selectedPackages
}

const hasIndependentVersion = (pkg) => INDEPENDENT_PREFIXES.some((prefix) => pkg.name.startsWith(prefix))

const classifyPackage = (pkg) => {
  if (pkg.dir === '.') return 'root'
  if (pkg.dir === 'website' || pkg.dir.startsWith('projects/')) return 'workspace'
  if (pkg.dir.startsWith('packages/') && pkg.name.startsWith(INTERNAL_SCOPE) && !pkg.private) {
    return hasIndependentVersion(pkg) ? 'independent' : 'internal'
  }
  return 'workspace'
}

const collectPackageFiles = async (rootDir, dir, files = []) => {
  const absDir = join(rootDir, dir)
  if (!(await exists(absDir))) return files

  const entries = await readdir(absDir, {withFileTypes: true})
  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist' || entry.name === '.git') continue

    const childDir = dir ? `${dir}/${entry.name}` : entry.name
    if (entry.isFile() && entry.name === PACKAGE_JSON) {
      files.push(childDir)
      continue
    }

    if (entry.isDirectory()) {
      await collectPackageFiles(rootDir, childDir, files)
    }
  }

  return files
}

export const discoverPackages = async (rootDir) => {
  const rootPath = join(rootDir, PACKAGE_JSON)
  const rootManifest = await readJson(rootPath)
  const packages = [
    {
      dir: '.',
      file: PACKAGE_JSON,
      path: rootPath,
      manifest: rootManifest,
      name: rootManifest.name,
      version: rootManifest.version,
      private: Boolean(rootManifest.private),
      publishConfig: rootManifest.publishConfig ?? {},
      classification: 'root',
    },
  ]

  for (const workspaceRoot of WORKSPACE_ROOTS) {
    const files = await collectPackageFiles(rootDir, workspaceRoot)
    for (const file of files) {
      const manifestPath = join(rootDir, file)
      const manifest = await readJson(manifestPath)
      const dir = toPosixPath(dirname(file))
      const pkg = {
        dir,
        file: toPosixPath(file),
        path: manifestPath,
        manifest,
        name: manifest.name,
        version: manifest.version,
        private: Boolean(manifest.private),
        publishConfig: manifest.publishConfig ?? {},
      }
      pkg.classification = classifyPackage(pkg)
      packages.push(pkg)
    }
  }

  return packages
}

export const createReleasePlan = async (rootDir) => {
  const packages = await discoverPackages(rootDir)
  const rootPackage = packages.find((pkg) => pkg.classification === 'root')
  const internalPackages = sortByName(packages.filter((pkg) => pkg.classification === 'internal'))
  const independentPackages = sortByName(packages.filter((pkg) => pkg.classification === 'independent'))
  const workspacePackages = sortByName(packages.filter((pkg) => pkg.classification === 'workspace'))

  return {
    rootDir,
    rootPackage,
    packages,
    internalPackages,
    independentPackages,
    workspacePackages,
  }
}

export const validateReleasePlan = (plan) => {
  const errors = []
  const root = plan.rootPackage

  if (!root.private) errors.push('root package must stay private')
  if (root.manifest.packageManager !== 'pnpm@10.33.0') {
    errors.push(`root packageManager must be pnpm@10.33.0, got ${root.manifest.packageManager ?? 'missing'}`)
  }
  if (root.manifest.engines?.node !== REQUIRED_NODE_ENGINE) {
    errors.push(`root engines.node must be ${REQUIRED_NODE_ENGINE}, got ${root.manifest.engines?.node ?? 'missing'}`)
  }
  if (root.manifest.engines?.pnpm !== '10.x') {
    errors.push(`root engines.pnpm must be 10.x, got ${root.manifest.engines?.pnpm ?? 'missing'}`)
  }

  for (const pkg of plan.internalPackages) {
    if (pkg.version !== root.version) {
      errors.push(`${pkg.file} version ${pkg.version} does not match root version ${root.version}`)
    }
    if (pkg.dir.startsWith('projects/') || pkg.dir === 'website') {
      errors.push(`${pkg.file} must not be in the internal publish set`)
    }
  }

  return errors
}

export const applyInternalVersion = async (plan, version) => {
  if (!version || typeof version !== 'string') {
    throw new Error('version is required')
  }

  const updateVersion = async (pkg) => {
    const nextManifest = {...pkg.manifest, version}
    await writeJson(pkg.path, nextManifest)
  }

  await updateVersion(plan.rootPackage)
  for (const pkg of plan.internalPackages) {
    await updateVersion(pkg)
  }
}

export const renderChangelogEntry = (plan, options = {}) => {
  const version = options.version ?? plan.rootPackage.version
  const date = options.date ?? new Date().toISOString().slice(0, 10)
  const tag = options.tag ?? DEFAULT_TAG
  const registry = options.registry ?? process.env.RELEASE_REGISTRY ?? '默认 npm registry'

  return `## ${version} - ${date}

### Highlights

- Publish EMP v4 alpha packages to \`${registry}\` with dist-tag \`${tag}\`.
- Align the root workspace and ${plan.internalPackages.length} core \`@empjs/*\` packages to \`${version}\`.
- Keep CDN and legacy runtime package lines independent for framework-specific runtime delivery.

### What's Changed

#### New Features

- feat(release): add unified alpha release automation for core \`@empjs/*\` packages.
- feat(release): generate guarded npm publish commands with dry-run by default.

#### Build

- chore(release): publish with pnpm 10 workspace filters and dist-tag \`${tag}\`.
- chore(release): exclude \`projects/**\`, \`website\`, \`@empjs/cdn-*\`, and \`@empjs/lib-*\` from the unified release set.

#### Full Changelog

- Pending GitHub release compare for \`${version}\`.
`
}

export const prependChangelog = async (rootDir, entry) => {
  const changelogPath = join(rootDir, 'CHANGELOG.md')
  const current = (await exists(changelogPath)) ? await readFile(changelogPath, 'utf8') : '# Changelog\n'
  const trimmedEntry = entry.trim()
  const body = current.startsWith('# Changelog')
    ? current.replace(/^# Changelog\s*/, `# Changelog\n\n${trimmedEntry}\n\n`)
    : `# Changelog\n\n${trimmedEntry}\n\n${current}`

  await writeFile(changelogPath, body.replace(/\n{3,}/g, '\n\n'))
}

export const buildPublishCommands = (plan, options = {}) => {
  const dryRun = options.dryRun ?? true
  const tag = options.tag ?? DEFAULT_TAG
  const access = options.access ?? DEFAULT_ACCESS
  const registry = options.registry ?? process.env.RELEASE_REGISTRY
  const packDir = options.packDir ?? join(plan.rootDir, '.release', 'npm')
  const internalPackages = selectInternalPackages(plan, options.packageName)

  if (!dryRun && !options.yes) {
    throw new Error('Real publish requires yes: true')
  }

  if (!dryRun) {
    return internalPackages.flatMap((pkg) => {
      const tarballPath = join(packDir, tarballFileName(pkg))
      const publishCommand = ['npm', 'publish', tarballPath, '--tag', tag, '--access', access]
      if (registry) publishCommand.push('--registry', registry)

      return [
        ['pnpm', '--filter', pkg.name, 'pack', '--out', tarballPath],
        publishCommand,
      ]
    })
  }

  return internalPackages.map((pkg) => {
    const command = [
      'pnpm',
      '--filter',
      pkg.name,
      'publish',
      '--tag',
      tag,
      '--access',
      access,
      '--no-git-checks',
    ]

    if (registry) command.push('--registry', registry)
    if (dryRun) command.push('--dry-run')

    return command
  })
}

export const buildPackCommands = (plan, options = {}) => {
  const dryRun = options.dryRun ?? true
  const internalPackages = selectInternalPackages(plan, options.packageName)
  if (!dryRun && !options.yes) {
    throw new Error('Real pack requires yes: true')
  }

  return internalPackages.map((pkg) => {
    const command = ['pnpm', '--filter', pkg.name, 'pack']
    if (dryRun) command.push('--dry-run')
    return command
  })
}

export const ensureDir = async (dirPath) => {
  await mkdir(dirPath, {recursive: true})
}

export const relativePackageDirs = (plan) =>
  plan.internalPackages.map((pkg) => relative(plan.rootDir, join(plan.rootDir, pkg.dir)))
