#!/usr/bin/env node
import {spawn} from 'node:child_process'
import {readFile} from 'node:fs/promises'
import process from 'node:process'

const protectedBranches = new Set(['main', 'master'])

const parseArgs = (argv) => {
  const options = {
    dryRun: false,
    push: false,
    allowProtectedBranch: false,
  }

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]
    if (arg === '--') continue
    if (arg === '--message' || arg === '-m') options.message = argv[++i]
    else if (arg === '--push') options.push = true
    else if (arg === '--dry-run') options.dryRun = true
    else if (arg === '--allow-protected-branch') options.allowProtectedBranch = true
    else if (arg === '--help' || arg === '-h') options.help = true
    else throw new Error(`Unknown argument: ${arg}`)
  }

  return options
}

const quote = (part) => (/[\s"'$]/.test(part) ? JSON.stringify(part) : part)

const commandText = (command) => command.map(quote).join(' ')
const verifyDisplay = 'pnpm ci:verify'
const diffCheckDisplay = 'git diff --check'
const addDisplay = 'git add -A'
const commitDisplay = 'git commit -m'
const pushDisplay = 'git push origin'

const run = (command, options = {}) =>
  new Promise((resolve, reject) => {
    console.log(`$ ${commandText(command)}`)
    if (options.dryRun) {
      resolve('')
      return
    }

    const child = spawn(command[0], command.slice(1), {
      cwd: options.cwd,
      stdio: options.capture ? ['ignore', 'pipe', 'pipe'] : 'inherit',
    })
    let stdout = ''
    let stderr = ''
    if (options.capture) {
      child.stdout.on('data', (chunk) => {
        stdout += chunk
      })
      child.stderr.on('data', (chunk) => {
        stderr += chunk
      })
    }
    child.on('error', reject)
    child.on('exit', (code) => {
      if (code === 0) {
        resolve(stdout.trim())
        return
      }

      reject(new Error(`Command failed with exit code ${code}: ${commandText(command)}\n${stderr.trim()}`))
    })
  })

const readPackageManager = async () => {
  const pkg = JSON.parse(await readFile('package.json', 'utf8'))
  return pkg.packageManager ?? 'pnpm@10.33.0'
}

const getBranch = async (dryRun) => {
  if (dryRun) return 'current-branch'
  return run(['git', 'branch', '--show-current'], {capture: true})
}

const hasChanges = async (dryRun) => {
  if (dryRun) return true
  const status = await run(['git', 'status', '--porcelain'], {capture: true})
  return Boolean(status)
}

const hasStagedChanges = async (dryRun) => {
  if (dryRun) return true
  try {
    await run(['git', 'diff', '--cached', '--quiet'], {capture: true})
    return false
  } catch {
    return true
  }
}

const main = async () => {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    console.log(`Usage: pnpm agent:finish -- --message <message> [--push] [--dry-run] [--allow-protected-branch]`)
    return
  }

  if (!options.message) {
    throw new Error('agent:finish requires --message <message>')
  }

  const branch = await getBranch(options.dryRun)
  if (!branch) throw new Error('Cannot determine current branch')
  if (protectedBranches.has(branch) && !options.allowProtectedBranch) {
    throw new Error(`Refusing to finish on protected branch ${branch}; pass --allow-protected-branch to override`)
  }

  const packageManager = await readPackageManager()
  await run(['corepack', packageManager, 'ci:verify'], {dryRun: options.dryRun})
  console.log(`# ${verifyDisplay}`)
  await run(['git', 'diff', '--check'], {dryRun: options.dryRun})
  console.log(`# ${diffCheckDisplay}`)

  if (await hasChanges(options.dryRun)) {
    await run(['git', 'add', '-A'], {dryRun: options.dryRun})
    console.log(`# ${addDisplay}`)
    if (await hasStagedChanges(options.dryRun)) {
      await run(['git', 'commit', '-m', options.message], {dryRun: options.dryRun})
      console.log(`# ${commitDisplay}`)
    } else {
      console.log('No staged changes to commit.')
    }
  } else {
    console.log('No local changes to commit.')
  }

  if (options.push) {
    await run(['git', 'push', 'origin', branch], {dryRun: options.dryRun})
    console.log(`# ${pushDisplay}`)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
