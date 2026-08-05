#!/usr/bin/env node

import fs from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import {fileURLToPath} from 'node:url'

const dependencyFields = ['dependencies', 'devDependencies', 'peerDependencies', 'optionalDependencies']
const ignoredDirectories = new Set([
  '.git',
  '.rslib',
  '.rspack-cache',
  '.turbo',
  'coverage',
  'dist',
  'node_modules',
  'output',
])

const decisionOrder = {
  ERROR: 0,
  MANUAL_REVIEW: 1,
  DEFER_COOLDOWN: 2,
  EVALUATE: 3,
  CURRENT: 4,
}

const tierWeight = {critical: 4, high: 3, medium: 2, low: 1}

export const parseVersion = value => {
  if (typeof value !== 'string') return null
  const match = value.trim().match(/^(?:v)?(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z.-]+))?$/)
  if (!match) return null
  return {
    major: Number(match[1]),
    minor: Number(match[2]),
    patch: Number(match[3]),
    prerelease: match[4] ?? null,
    raw: value.replace(/^v/, ''),
  }
}

export const compareVersions = (leftValue, rightValue) => {
  const left = parseVersion(leftValue)
  const right = parseVersion(rightValue)
  if (!left || !right) return 0
  for (const key of ['major', 'minor', 'patch']) {
    if (left[key] !== right[key]) return left[key] > right[key] ? 1 : -1
  }
  if (left.prerelease === right.prerelease) return 0
  if (left.prerelease == null) return 1
  if (right.prerelease == null) return -1
  return left.prerelease.localeCompare(right.prerelease, undefined, {numeric: true})
}

const maxVersion = versions => versions.filter(parseVersion).sort(compareVersions).at(-1) ?? null

export const extractVersionFromRange = range => {
  if (typeof range !== 'string') return null
  const match = range.match(/(?:^|[^\d])(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)/)
  return match?.[1] ?? null
}

export const versionDelta = (currentValue, candidateValue) => {
  const current = parseVersion(currentValue)
  const candidate = parseVersion(candidateValue)
  if (!current || !candidate || compareVersions(candidateValue, currentValue) <= 0) return 'none'
  if (candidate.major !== current.major) return 'major'
  if (candidate.minor !== current.minor) return current.major === 0 ? 'zero-minor' : 'minor'
  if (candidate.patch !== current.patch) return 'patch'
  return candidate.prerelease !== current.prerelease ? 'prerelease' : 'none'
}

const normalizePath = value => value.split(path.sep).join('/')

const listFiles = async (root, relativeDirectory = '.') => {
  const directory = path.join(root, relativeDirectory)
  const entries = await fs.readdir(directory, {withFileTypes: true})
  const files = []
  for (const entry of entries) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue
    const relativePath = normalizePath(path.join(relativeDirectory, entry.name)).replace(/^\.\//, '')
    if (entry.isDirectory()) files.push(...(await listFiles(root, relativePath)))
    else if (entry.isFile()) files.push(relativePath)
  }
  return files
}

const readJson = async file => JSON.parse(await fs.readFile(file, 'utf8'))

const findDeclarations = async (root, dependency) => {
  if (dependency.source === 'packageManager') {
    const manifest = await readJson(path.join(root, 'package.json'))
    const match = manifest.packageManager?.match(/^pnpm@(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?)$/)
    return match
      ? [{file: 'package.json', field: 'packageManager', range: manifest.packageManager, version: match[1]}]
      : []
  }

  const paths = dependency.includePaths ?? []
  const declarations = []
  for (const relativePath of paths) {
    const manifest = await readJson(path.join(root, relativePath))
    for (const field of dependencyFields) {
      const range = manifest[field]?.[dependency.name]
      if (!range) continue
      declarations.push({file: relativePath, field, range, version: extractVersionFromRange(range)})
    }
  }
  return declarations
}

const findLockfileVersions = async (root, packageName) => {
  const lockfile = await fs.readFile(path.join(root, 'pnpm-lock.yaml'), 'utf8')
  const escaped = packageName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const pattern = new RegExp(`^  ['"]?${escaped}@(\\d+\\.\\d+\\.\\d+(?:-[0-9A-Za-z.-]+)?)`, 'gm')
  return [...lockfile.matchAll(pattern)].map(match => match[1])
}

const findConfigSignals = async (root, dependency, allFiles) => {
  const signals = []
  for (const signal of dependency.configSignals ?? []) {
    const pattern = new RegExp(signal.pattern)
    const pathPattern = signal.pathPattern ? new RegExp(signal.pathPattern) : null
    const matches = []
    for (const file of allFiles) {
      if (!/\.(?:[cm]?[jt]s|json|md|toml|ya?ml)$/.test(file)) continue
      if (pathPattern && !pathPattern.test(file)) continue
      const content = await fs.readFile(path.join(root, file), 'utf8')
      if (pattern.test(content)) matches.push(file)
    }
    if (matches.length > 0) signals.push({reason: signal.reason, files: matches})
  }
  return signals
}

const releaseAgeHours = (packument, version, now) => {
  const publishedAt = packument.time?.[version]
  if (!publishedAt) return {publishedAt: null, ageHours: null}
  return {publishedAt, ageHours: Math.max(0, (now.getTime() - new Date(publishedAt).getTime()) / 3_600_000)}
}

const metadataChanges = (packument, current, candidate) => {
  const currentMetadata = packument.versions?.[current] ?? {}
  const candidateMetadata = packument.versions?.[candidate] ?? {}
  const currentEngines = JSON.stringify(currentMetadata.engines ?? {})
  const candidateEngines = JSON.stringify(candidateMetadata.engines ?? {})
  const currentPeers = JSON.stringify(currentMetadata.peerDependencies ?? {})
  const candidatePeers = JSON.stringify(candidateMetadata.peerDependencies ?? {})
  return {
    engineChanged: currentEngines !== candidateEngines,
    peerDependenciesChanged: currentPeers !== candidatePeers,
    currentEngines: currentMetadata.engines ?? {},
    candidateEngines: candidateMetadata.engines ?? {},
    currentPeerDependencies: currentMetadata.peerDependencies ?? {},
    candidatePeerDependencies: candidateMetadata.peerDependencies ?? {},
  }
}

const selectCandidate = (packument, current, dependency, defaultPrereleaseTags) => {
  const candidates = []
  const stableTag = dependency.stableTag ?? 'latest'
  const stable = packument['dist-tags']?.[stableTag]
  if (stable && compareVersions(stable, current) > 0) {
    candidates.push({channel: stableTag, version: stable, stable: true})
  }
  const prereleaseTags = dependency.prereleaseTags ?? defaultPrereleaseTags
  for (const tag of prereleaseTags) {
    const version = packument['dist-tags']?.[tag]
    if (!dependency.includeDevPrereleases && /-(?:dev|canary|nightly)[.-]/i.test(version ?? '')) continue
    if (version && compareVersions(version, current) > 0) {
      candidates.push({channel: tag, version, stable: false})
    }
  }
  return candidates.sort((left, right) => {
    if (left.channel === stableTag && right.channel !== stableTag) return -1
    if (right.channel === stableTag && left.channel !== stableTag) return 1
    return compareVersions(right.version, left.version)
  })[0] ?? null
}

export const judgeUpgrade = ({
  dependency,
  current,
  candidate,
  packument,
  signals = [],
  cooldownHours,
  now = new Date(),
}) => {
  if (!candidate) {
    return {
      decision: 'CURRENT',
      delta: 'none',
      priority: 0,
      reasons: ['稳定版与受监控预发布通道均无更高版本'],
    }
  }

  const delta = versionDelta(current, candidate.version)
  const release = releaseAgeHours(packument, candidate.version, now)
  const metadata = metadataChanges(packument, current, candidate.version)
  const signalFileCount = new Set(signals.flatMap(signal => signal.files)).size
  const reasons = [`发现 ${candidate.channel} 通道 ${candidate.version}（${delta}）`]
  let decision = 'EVALUATE'

  if (!candidate.stable) {
    decision = 'MANUAL_REVIEW'
    reasons.push('预发布版本不得自动升级，必须评审迁移价值与回滚方案')
  }
  if (delta === 'major' || delta === 'zero-minor') {
    decision = 'MANUAL_REVIEW'
    reasons.push(delta === 'zero-minor' ? '0.x minor 按潜在破坏性升级处理' : 'major 升级按破坏性变更处理')
  }
  if (metadata.engineChanged) {
    decision = 'MANUAL_REVIEW'
    reasons.push('Node engines 声明发生变化')
  }
  if (metadata.peerDependenciesChanged) {
    decision = 'MANUAL_REVIEW'
    reasons.push('peerDependencies 声明发生变化')
  }
  if (signalFileCount > 0) {
    decision = 'MANUAL_REVIEW'
    reasons.push(`命中 ${signalFileCount} 个迁移相关配置文件`)
  }
  if (decision === 'EVALUATE' && release.ageHours != null && release.ageHours < cooldownHours) {
    decision = 'DEFER_COOLDOWN'
    reasons.push(`发布不足 ${cooldownHours} 小时，等待冷却期后再进入升级验证`)
  }

  const deltaWeight = {major: 4, 'zero-minor': 4, minor: 3, patch: 1, prerelease: 2, none: 0}[delta]
  const priority = tierWeight[dependency.tier] * 10 + deltaWeight + signalFileCount * 3
  return {decision, delta, priority, reasons, release, metadata}
}

const registryPackument = async (packageName, registry) => {
  const response = await fetch(`${registry.replace(/\/$/, '')}/${encodeURIComponent(packageName)}`, {
    headers: {accept: 'application/json'},
    signal: AbortSignal.timeout(15_000),
  })
  if (!response.ok) throw new Error(`${response.status} ${response.statusText}`)
  return response.json()
}

export const registryDisplayName = registry => {
  try {
    const url = new URL(registry)
    return url.origin === 'https://registry.npmjs.org' ? url.origin : '<configured-registry>'
  } catch {
    return '<configured-registry>'
  }
}

const evaluateDependency = async ({root, dependency, policy, registry, allFiles, now}) => {
  try {
    const declarations = await findDeclarations(root, dependency)
    const lockfileVersions = await findLockfileVersions(root, dependency.name)
    const declaredVersions = declarations.map(item => item.version).filter(Boolean)
    const current = maxVersion([...declaredVersions, ...lockfileVersions])
    if (!current) throw new Error('无法从 manifest 或 lockfile 确定当前版本')

    const packument = await registryPackument(dependency.name, registry)
    const candidate = selectCandidate(packument, current, dependency, policy.prereleaseTags)
    const signals = await findConfigSignals(root, dependency, allFiles)
    const judgment = judgeUpgrade({
      dependency,
      current,
      candidate,
      packument,
      signals,
      cooldownHours: policy.releaseCooldownHours,
      now,
    })

    return {
      name: dependency.name,
      tier: dependency.tier,
      areas: dependency.areas,
      current,
      stableTag: dependency.stableTag ?? 'latest',
      stable: packument['dist-tags']?.[dependency.stableTag ?? 'latest'] ?? null,
      globalLatest: packument['dist-tags']?.latest ?? null,
      prereleases: Object.fromEntries(
        (dependency.prereleaseTags ?? policy.prereleaseTags)
          .map(tag => [tag, packument['dist-tags']?.[tag]])
          .filter(([, version]) =>
            version &&
            (dependency.includeDevPrereleases || !/-(?:dev|canary|nightly)[.-]/i.test(version)) &&
            compareVersions(version, current) > 0,
          ),
      ),
      candidate,
      declarations,
      lockfileVersions: [...new Set(lockfileVersions)].sort(compareVersions),
      signals,
      ...judgment,
    }
  } catch (error) {
    return {
      name: dependency.name,
      tier: dependency.tier,
      areas: dependency.areas,
      current: null,
      candidate: null,
      decision: 'ERROR',
      delta: 'unknown',
      priority: Number.MAX_SAFE_INTEGER,
      reasons: [error.message],
    }
  }
}

export const evaluateCoreDependencies = async ({
  root = process.cwd(),
  policyPath = path.join(root, 'scripts/core-dependency-policy.json'),
  registry = process.env.npm_config_registry ?? 'https://registry.npmjs.org',
  now = new Date(),
} = {}) => {
  const policy = await readJson(policyPath)
  if (policy.schemaVersion !== 1) throw new Error(`unsupported policy schema: ${policy.schemaVersion}`)
  const allFiles = await listFiles(root)
  const results = await Promise.all(
    policy.dependencies.map(dependency =>
      evaluateDependency({root, dependency, policy, registry, allFiles, now}),
    ),
  )
  results.sort((left, right) => {
    const decision = decisionOrder[left.decision] - decisionOrder[right.decision]
    return decision || right.priority - left.priority || left.name.localeCompare(right.name)
  })
  return {
    schemaVersion: 1,
    checkedAt: now.toISOString(),
    registry: registryDisplayName(registry),
    releaseCooldownHours: policy.releaseCooldownHours,
    summary: Object.fromEntries(
      Object.keys(decisionOrder).map(decision => [decision, results.filter(item => item.decision === decision).length]),
    ),
    results,
  }
}

const shortReasons = result => result.reasons.join('；').replaceAll('|', '\\|')

export const renderMarkdown = report => {
  const rows = report.results.map(result => {
    const candidate = result.candidate ? `${result.candidate.version} (${result.candidate.channel})` : '-'
    const signals = new Set(result.signals?.flatMap(signal => signal.files) ?? []).size
    return `| ${result.name} | ${result.current ?? '-'} | ${result.stable ?? '-'} | ${candidate} | ${result.delta} | ${signals} | ${result.decision} | ${shortReasons(result)} |`
  })
  return [
    `检查时间：${report.checkedAt}`,
    '',
    '| 依赖 | 当前 | stable | 候选 | 跨度 | 配置命中 | 判断 | 因素 |',
    '| --- | ---: | ---: | ---: | --- | ---: | --- | --- |',
    ...rows,
  ].join('\n')
}

const help = `用法：node scripts/core-dependency-upgrade-check.mjs [选项]

选项：
  --format markdown|json       输出格式，默认 markdown
  --fail-on none|update|review 门禁：发现更新或人工评审项时返回非零，默认 none
  --registry URL               npm registry，默认读取 npm_config_registry
  --help                       显示帮助

判断范围由 scripts/core-dependency-policy.json 管理。脚本只提供升级证据，不修改依赖。`

export const parseArgs = args => {
  const options = {format: 'markdown', failOn: 'none', registry: undefined}
  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--') continue
    if (arg === '--help') return {...options, help: true}
    if (arg === '--format') options.format = args[++index]
    else if (arg === '--fail-on') options.failOn = args[++index]
    else if (arg === '--registry') options.registry = args[++index]
    else throw new Error(`unknown argument: ${arg}`)
  }
  if (!['markdown', 'json'].includes(options.format)) throw new Error(`invalid --format: ${options.format}`)
  if (!['none', 'update', 'review'].includes(options.failOn)) throw new Error(`invalid --fail-on: ${options.failOn}`)
  return options
}

const run = async () => {
  const options = parseArgs(process.argv.slice(2))
  if (options.help) {
    console.log(help)
    return
  }
  const report = await evaluateCoreDependencies({registry: options.registry})
  console.log(options.format === 'json' ? JSON.stringify(report, null, 2) : renderMarkdown(report))
  if (report.summary.ERROR > 0) process.exitCode = 2
  else if (options.failOn === 'update' && report.results.some(result => result.decision !== 'CURRENT')) process.exitCode = 3
  else if (options.failOn === 'review' && report.summary.MANUAL_REVIEW > 0) process.exitCode = 4
}

const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)
if (isMain) run().catch(error => {
  console.error(error.message)
  process.exitCode = 2
})
