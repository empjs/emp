#!/usr/bin/env node
import {spawn} from 'node:child_process'
import {join} from 'node:path'
import process from 'node:process'
import {
  applyInternalVersion,
  buildPackCommands,
  buildPublishCommands,
  createReleasePlan,
  ensureDir,
  prependChangelog,
  renderChangelogEntry,
  validateReleasePlan,
} from './release-core.mjs'

const help = `EMP release automation

Usage:
  node scripts/release.mjs check [--root <dir>]
  node scripts/release.mjs version <version> [--root <dir>]
  node scripts/release.mjs changelog [--version <version>] [--date <yyyy-mm-dd>] [--tag <tag>] [--registry <url>]
  node scripts/release.mjs pack [--dry-run] [--yes] [--skip-build] [--package <name>]
  node scripts/release.mjs publish [--dry-run] [--yes] [--skip-build] [--tag <tag>] [--registry <url>] [--package <name>]

Defaults:
  --tag beta
`

const parseArgs = (argv) => {
  const [command, ...rest] = argv
  const options = {
    command,
    positional: [],
    root: process.cwd(),
    dryRun: undefined,
    yes: false,
    skipBuild: false,
    tag: process.env.RELEASE_TAG ?? 'beta',
    registry: process.env.RELEASE_REGISTRY,
  }

  for (let i = 0; i < rest.length; i += 1) {
    const arg = rest[i]
    if (arg === '--root') options.root = rest[++i]
    else if (arg === '--version') options.version = rest[++i]
    else if (arg === '--date') options.date = rest[++i]
    else if (arg === '--tag') options.tag = rest[++i]
    else if (arg === '--registry') options.registry = rest[++i]
    else if (arg === '--package') options.packageName = rest[++i]
    else if (arg === '--dry-run') options.dryRun = true
    else if (arg === '--no-dry-run') options.dryRun = false
    else if (arg === '--yes') options.yes = true
    else if (arg === '--skip-build') options.skipBuild = true
    else if (arg === '--help' || arg === '-h') options.help = true
    else options.positional.push(arg)
  }

  return options
}

const quote = (part) => (/[\s"'$]/.test(part) ? JSON.stringify(part) : part)

const resolveCommand = (command, options = {}) => {
  const packageManager = options.packageManager
  if (command[0] === 'pnpm' && packageManager) {
    return ['corepack', packageManager, ...command.slice(1)]
  }

  return command
}

const runCommand = (command, options = {}) =>
  new Promise((resolve, reject) => {
    const resolvedCommand = resolveCommand(command, options)
    console.log(`$ ${resolvedCommand.map(quote).join(' ')}`)
    if (options.printOnly) {
      resolve()
      return
    }

    const child = spawn(resolvedCommand[0], resolvedCommand.slice(1), {stdio: 'inherit'})
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) resolve()
      else reject(new Error(`Command failed with exit code ${code}: ${resolvedCommand.join(' ')}`))
    })
  })

const printPlan = (plan) => {
  console.log(`Root version: ${plan.rootPackage.version}`)
  console.log(`Internal packages: ${plan.internalPackages.length}`)
  for (const pkg of plan.internalPackages) {
    console.log(`  - ${pkg.name} (${pkg.dir})`)
  }
  console.log(`Independent packages: ${plan.independentPackages.length}`)
  console.log(`Workspace packages: ${plan.workspacePackages.length}`)
}

const runBuild = async (skipBuild, packageManager) => {
  if (skipBuild) {
    console.log('Skip build: true')
    return
  }

  await runCommand(['pnpm', 'empbuild'], {packageManager})
}

const main = async () => {
  const options = parseArgs(process.argv.slice(2))
  if (options.help || !options.command) {
    console.log(help)
    return
  }

  const plan = await createReleasePlan(options.root)
  const errors = validateReleasePlan(plan)

  if (options.command === 'check') {
    printPlan(plan)
    if (errors.length) {
      console.error('\nRelease validation failed:')
      for (const error of errors) console.error(`  - ${error}`)
      process.exitCode = 1
    }
    return
  }

  if (errors.length) {
    throw new Error(`Release validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}`)
  }

  const packageManager = plan.rootPackage.manifest.packageManager

  if (options.command === 'version') {
    const version = options.positional[0] ?? options.version
    if (!version) throw new Error('version command requires a version')
    await applyInternalVersion(plan, version)
    console.log(`Internal release version updated to ${version}`)
    return
  }

  if (options.command === 'changelog') {
    const entry = renderChangelogEntry(plan, {
      version: options.version ?? plan.rootPackage.version,
      date: options.date,
      tag: options.tag,
      registry: options.registry,
    })
    await prependChangelog(options.root, entry)
    console.log(`CHANGELOG.md prepended for ${options.version ?? plan.rootPackage.version}`)
    return
  }

  if (options.command === 'pack') {
    const dryRun = options.dryRun ?? !options.yes
    await runBuild(options.skipBuild, packageManager)
    for (const command of buildPackCommands(plan, {
      dryRun,
      yes: options.yes,
      packageName: options.packageName,
    })) {
      await runCommand(command, {packageManager})
    }
    return
  }

  if (options.command === 'publish') {
    const dryRun = options.dryRun ?? !options.yes
    const packDir = join(options.root, '.release', 'npm')
    await runBuild(options.skipBuild, packageManager)
    if (!dryRun) await ensureDir(packDir)
    for (const command of buildPublishCommands(plan, {
      dryRun,
      yes: options.yes,
      tag: options.tag,
      registry: options.registry,
      packDir,
      packageName: options.packageName,
    })) {
      await runCommand(command, {packageManager})
    }
    return
  }

  throw new Error(`Unknown command: ${options.command}`)
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
