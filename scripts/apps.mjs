import {execFile as execFileCallback} from 'node:child_process'
import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {promisify} from 'node:util'

const execFile = promisify(execFileCallback)
const requiredScripts = ['dev', 'build', 'start', 'stat']
const configFiles = ['emp.config.ts', 'emp-config.ts', 'emp.config.js', 'emp-config.js']
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

const pathExists = async filePath =>
  fs.access(filePath).then(
    () => true,
    () => false,
  )

const readJson = async filePath => JSON.parse(await fs.readFile(filePath, 'utf8'))

export async function discoverApps(root = repoRoot) {
  const appsRoot = path.join(root, 'apps')
  if (!(await pathExists(appsRoot))) return []

  const entries = await fs.readdir(appsRoot, {withFileTypes: true})
  const apps = []
  for (const entry of entries) {
    if (!entry.isDirectory()) continue
    const appRoot = path.join(appsRoot, entry.name)
    const packagePath = path.join(appRoot, 'package.json')
    if (!(await pathExists(packagePath))) continue
    const pkg = await readJson(packagePath)
    let configFile = ''
    for (const file of configFiles) {
      if (await pathExists(path.join(appRoot, file))) {
        configFile = file
        break
      }
    }
    apps.push({
      dir: entry.name,
      name: pkg.name ?? entry.name,
      root: appRoot,
      packagePath,
      configFile: configFile ? path.join(appRoot, configFile) : '',
      scripts: pkg.scripts ?? {},
    })
  }
  return apps.sort((a, b) => a.name.localeCompare(b.name))
}

export async function validateApps(apps) {
  const issues = []
  for (const app of apps) {
    if (!app.configFile) {
      issues.push({app: app.name, field: 'config', message: '缺少 EMP 配置文件'})
    }
    if (!(await pathExists(path.join(app.root, 'src')))) {
      issues.push({app: app.name, field: 'src', message: '缺少 src 目录'})
    }
    for (const scriptName of requiredScripts) {
      if (!app.scripts[scriptName]) {
        issues.push({app: app.name, field: `scripts.${scriptName}`, message: `缺少 ${scriptName} 脚本`})
      }
    }
  }
  return issues
}

async function collectDistMetrics(appRoot) {
  const distRoot = path.join(appRoot, 'dist')
  if (!(await pathExists(distRoot))) return {distSizeBytes: 0, assets: []}

  const assets = []
  let distSizeBytes = 0
  const walk = async dir => {
    const entries = await fs.readdir(dir, {withFileTypes: true})
    for (const entry of entries) {
      const filePath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        await walk(filePath)
        continue
      }
      const stat = await fs.stat(filePath)
      distSizeBytes += stat.size
      const relativePath = path.relative(distRoot, filePath)
      if (/\.(js|css)$/.test(entry.name)) {
        assets.push({path: relativePath, sizeBytes: stat.size})
      }
    }
  }
  await walk(distRoot)
  return {distSizeBytes, assets: assets.sort((a, b) => a.path.localeCompare(b.path))}
}

function parseAppFilter(value) {
  if (!value) return undefined
  return value
    .split(',')
    .map(item => item.trim())
    .filter(Boolean)
}

export async function runBench({apps, cwd = repoRoot, dryRun = false} = {}) {
  const discovered = await discoverApps(cwd)
  const selected = apps?.length ? discovered.filter(app => apps.includes(app.name) || apps.includes(app.dir)) : discovered
  const results = []

  for (const app of selected) {
    const command = `pnpm --filter ${app.name} build`
    const startedAt = Date.now()
    let exitCode = 0
    let stdout = ''
    let stderr = ''
    if (!dryRun) {
      try {
        const result = await execFile('pnpm', ['--filter', app.name, 'build'], {
          cwd,
          maxBuffer: 1024 * 1024 * 20,
        })
        stdout = result.stdout
        stderr = result.stderr
      } catch (error) {
        exitCode = error.code ?? 1
        stdout = error.stdout ?? ''
        stderr = error.stderr ?? error.message
      }
    }
    const durationMs = dryRun ? 0 : Date.now() - startedAt
    const metrics = await collectDistMetrics(app.root)
    results.push({
      name: app.name,
      dir: app.dir,
      command,
      exitCode,
      durationMs,
      ...metrics,
      stdout: exitCode === 0 ? '' : stdout.trim(),
      stderr: exitCode === 0 ? '' : stderr.trim(),
    })
  }
  return results
}

async function main() {
  const [, , command = 'list', ...args] = process.argv
  const appArgIndex = args.indexOf('--apps')
  const appFilter = appArgIndex >= 0 ? parseAppFilter(args[appArgIndex + 1]) : undefined
  const dryRun = args.includes('--dry-run')

  if (command === 'list') {
    const apps = await discoverApps(repoRoot)
    console.log(JSON.stringify(apps.map(({name, dir, configFile}) => ({name, dir, configFile})), null, 2))
    return
  }

  if (command === 'check') {
    const apps = await discoverApps(repoRoot)
    const issues = await validateApps(apps)
    if (apps.length === 0) {
      console.error('apps 目录下没有可验收项目')
      process.exitCode = 1
      return
    }
    if (issues.length > 0) {
      console.error(JSON.stringify(issues, null, 2))
      process.exitCode = 1
      return
    }
    console.log(JSON.stringify({apps: apps.map(app => app.name), issues}, null, 2))
    return
  }

  if (command === 'bench') {
    const results = await runBench({apps: appFilter, cwd: repoRoot, dryRun})
    console.log(JSON.stringify(results, null, 2))
    if (results.some(result => result.exitCode !== 0)) {
      process.exitCode = 1
    }
    return
  }

  console.error(`未知命令：${command}`)
  process.exitCode = 1
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await main()
}
