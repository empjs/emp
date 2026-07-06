#!/usr/bin/env node
import {execFileSync, spawn} from 'node:child_process'
import {existsSync, readFileSync} from 'node:fs'
import {mkdir, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {
  ROOT_BROWSER_TEST_TARGETS,
  ROOT_TEST_TARGETS,
  rootBrowserTestCommand,
  rootTestCommand,
} from './root-test-targets.mjs'

const repoRootFromModule = fileURLToPath(new URL('..', import.meta.url))
const defaultOutputFile = '.release/acceptance/index.html'
const brandLogoPath = 'docs/assets/emp-v4-logo.png'

export const DEFAULT_ACCEPTANCE_COMMANDS = Object.freeze([
  {
    id: 'workflow-check',
    label: 'workflow:check',
    command: ['corepack', 'pnpm', 'workflow:check'],
    required: true,
    scope: '仓库工作流约束',
  },
  {
    id: 'ci-verify',
    label: 'ci:verify',
    command: ['corepack', 'pnpm', 'ci:verify'],
    required: true,
    scope: '根 CI 验证链路',
  },
  {
    id: 'empbuild',
    label: 'empbuild',
    command: ['corepack', 'pnpm', 'empbuild'],
    required: true,
    scope: '核心包构建产物',
  },
  {
    id: 'apps-acceptance',
    label: 'apps:acceptance',
    command: ['corepack', 'pnpm', 'apps:acceptance'],
    required: true,
    scope: 'apps 构建验收',
  },
  {
    id: 'release-publish-dry',
    label: 'release:publish:dry -- --skip-build',
    command: ['corepack', 'pnpm', 'release:publish:dry', '--', '--skip-build'],
    required: true,
    scope: '发布 dry-run',
  },
  {
    id: 'apps-browser',
    label: 'test:apps:browser',
    command: ['corepack', 'pnpm', 'test:apps:browser'],
    required: false,
    scope: 'apps 浏览器 E2E',
    runFlag: '--include-browser',
  },
])

const statusText = {
  passed: '通过',
  failed: '失败',
  skipped: '跳过',
}

const overallText = {
  passed: '通过',
  failed: '阻塞',
  skipped: '未执行',
  warning: '需关注',
}

const formatCommand = command => command.map(part => (/[\s"'$]/.test(part) ? JSON.stringify(part) : part)).join(' ')

const escapeHtml = value =>
  String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')

const formatDuration = durationMs => {
  if (!Number.isFinite(durationMs) || durationMs <= 0) return '-'
  if (durationMs < 1000) return `${Math.round(durationMs)}ms`
  const totalSeconds = Math.round(durationMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60
  return minutes > 0 ? `${minutes}m ${seconds}s` : `${seconds}s`
}

const safeReadJson = file => {
  try {
    return JSON.parse(readFileSync(file, 'utf8'))
  } catch {
    return null
  }
}

const readBrandLogo = repoRoot => {
  try {
    const logo = readFileSync(path.join(repoRoot, brandLogoPath))
    return {
      sourcePath: brandLogoPath,
      dataUri: `data:image/png;base64,${logo.toString('base64')}`,
    }
  } catch {
    return null
  }
}

const readGitMetadata = repoRoot => {
  const pkg = safeReadJson(path.join(repoRoot, 'package.json')) ?? {}
  const run = (args, fallback = '-') => {
    try {
      const result = execFileSync('git', args, {
        cwd: repoRoot,
        encoding: 'utf8',
        stdio: ['ignore', 'pipe', 'ignore'],
      })
      return String(result).trim() || fallback
    } catch {
      return fallback
    }
  }
  const branch = run(['branch', '--show-current'])
  const commit = run(['rev-parse', '--short', 'HEAD'])
  const fullCommit = run(['rev-parse', 'HEAD'])
  const status = run(['status', '--short'], '')

  return {
    project: pkg.name ?? 'emp-workspace',
    version: pkg.version ?? '-',
    branch,
    commit,
    fullCommit,
    dirty: status.length > 0,
    dirtySummary: status || 'clean',
  }
}

const readDocsBoundaries = repoRoot => {
  const matrixFile = path.join(repoRoot, 'docs/testing/apps-feature-test-matrix.md')
  if (!existsSync(matrixFile)) return []

  const content = readFileSync(matrixFile, 'utf8')
  const boundaries = []
  for (const line of content.split('\n')) {
    if (!line.startsWith('| `') || !line.includes('剩余 P2')) continue
    const cells = line
      .split('|')
      .slice(1, -1)
      .map(cell => cell.trim())
    if (cells.length < 6) continue
    boundaries.push({
      subject: cells[0].replaceAll('`', ''),
      boundary: cells[5],
    })
  }
  return boundaries
}

const createTargetRows = (targets, commandBuilder) =>
  Object.entries(targets).map(([id, files]) => ({
    id,
    command: commandBuilder(id),
    files: [...files],
    fileCount: files.length,
  }))

const summarizeCommands = commandResults => {
  const summary = {passed: 0, failed: 0, skipped: 0, total: commandResults.length}
  for (const result of commandResults) {
    if (result.status === 'failed') summary.failed += 1
    else if (result.status === 'skipped') summary.skipped += 1
    else summary.passed += 1
  }
  return summary
}

const resolveOverallStatus = commandResults => {
  const requiredResults = commandResults.filter(result => result.required)
  if (requiredResults.some(result => result.status === 'failed')) return 'failed'
  if (requiredResults.length > 0 && requiredResults.every(result => result.status === 'skipped')) return 'skipped'
  if (requiredResults.some(result => result.status === 'skipped')) return 'warning'
  if (commandResults.some(result => !result.required && result.status === 'failed')) return 'warning'
  return 'passed'
}

export const buildAcceptanceReportModel = ({
  repoRoot = repoRootFromModule,
  generatedAt = new Date().toISOString(),
  commandResults,
  metadata,
} = {}) => {
  const normalizedCommandResults = commandResults ?? []
  const rootTargets = createTargetRows(ROOT_TEST_TARGETS, rootTestCommand)
  const browserTargets = createTargetRows(ROOT_BROWSER_TEST_TARGETS, rootBrowserTestCommand)
  const uncoveredBoundaries = readDocsBoundaries(repoRoot)

  return {
    title: 'EMP v4 发布验收凭证',
    generatedAt,
    generatedAtText: new Intl.DateTimeFormat('zh-CN', {
      dateStyle: 'medium',
      timeStyle: 'medium',
      timeZone: 'Asia/Shanghai',
    }).format(new Date(generatedAt)),
    brandLogo: readBrandLogo(repoRoot),
    metadata: metadata ?? readGitMetadata(repoRoot),
    overallStatus: resolveOverallStatus(normalizedCommandResults),
    commandSummary: summarizeCommands(normalizedCommandResults),
    commandResults: normalizedCommandResults,
    rootTargets,
    browserTargets,
    coverageSummary: {
      rootTargets: rootTargets.length,
      browserTargets: browserTargets.length,
      rootTestFiles: ROOT_TEST_TARGETS.all.length,
      browserTestFiles: ROOT_BROWSER_TEST_TARGETS['browser-all'].length,
      uncoveredBoundaries: uncoveredBoundaries.length,
    },
    uncoveredBoundaries,
  }
}

const renderStatusBadge = status =>
  `<span class="release-badge release-badge-${escapeHtml(getStatusClass(status))}"><span class="release-badge-dot"></span>${escapeHtml(statusText[status] ?? status)}</span>`

const getStatusClass = status => {
  if (status === 'passed') return 'passed'
  if (status === 'failed') return 'failed'
  return 'skipped'
}

const getGateSubtext = status => {
  if (status === 'passed') return '满足发布条件'
  if (status === 'failed') return '未满足发布条件'
  if (status === 'warning') return '存在可选项异常'
  return '尚未执行发布命令'
}

const formatPercentValue = (value, total) => {
  if (!total) return 0
  return Math.round((value / total) * 100)
}

const renderCommandDistribution = summary => {
  const width = 312
  const passedWidth = Math.round((formatPercentValue(summary.passed, summary.total) / 100) * width)
  const skippedWidth = Math.round((formatPercentValue(summary.skipped, summary.total) / 100) * width)
  const failedWidth = summary.total ? Math.max(width - passedWidth - skippedWidth, 0) : 0
  const skippedX = 24 + passedWidth
  const failedX = skippedX + skippedWidth

  return `<svg class="command-distribution" aria-label="命令结果分布" role="img" viewBox="0 0 360 168">
    <title>命令结果分布</title>
    <desc>通过 ${escapeHtml(summary.passed)}，跳过 ${escapeHtml(summary.skipped)}，失败 ${escapeHtml(summary.failed)}，总计 ${escapeHtml(summary.total)}</desc>
    <rect class="chart-track" x="24" y="46" width="${escapeHtml(width)}" height="20" rx="10"></rect>
    <rect class="chart-segment chart-passed" x="24" y="46" width="${escapeHtml(passedWidth)}" height="20" rx="10"></rect>
    <rect class="chart-segment chart-skipped" x="${escapeHtml(skippedX)}" y="46" width="${escapeHtml(skippedWidth)}" height="20"></rect>
    <rect class="chart-segment chart-failed" x="${escapeHtml(failedX)}" y="46" width="${escapeHtml(failedWidth)}" height="20" rx="10"></rect>
    <g class="chart-axis">
      <text x="24" y="102">通过 ${escapeHtml(formatPercentValue(summary.passed, summary.total))}%</text>
      <text x="150" y="102">跳过 ${escapeHtml(formatPercentValue(summary.skipped, summary.total))}%</text>
      <text x="274" y="102">失败 ${escapeHtml(formatPercentValue(summary.failed, summary.total))}%</text>
    </g>
    <g class="chart-legend">
      <circle class="chart-dot chart-passed" cx="30" cy="132" r="4"></circle>
      <text x="42" y="136">${escapeHtml(summary.passed)} passed</text>
      <circle class="chart-dot chart-skipped" cx="144" cy="132" r="4"></circle>
      <text x="156" y="136">${escapeHtml(summary.skipped)} skipped</text>
      <circle class="chart-dot chart-failed" cx="270" cy="132" r="4"></circle>
      <text x="282" y="136">${escapeHtml(summary.failed)} failed</text>
    </g>
  </svg>`
}

const renderCommandRows = commandResults =>
  commandResults
    .map(
      (result, index) => `<tr>
        <td><span class="step-index step-${escapeHtml(getStatusClass(result.status))}">${escapeHtml(index + 1)}</span></td>
        <td>
          <div class="command-name"><code>${escapeHtml(result.label)}</code><span>${escapeHtml(result.command ?? '-')}</span></div>
        </td>
        <td>${renderStatusBadge(result.status)}</td>
        <td>${escapeHtml(result.required ? '必需' : '可选')}</td>
        <td>${escapeHtml(formatDuration(result.durationMs))}</td>
        <td class="mono">${escapeHtml(result.startedAt ? new Intl.DateTimeFormat('zh-CN', {hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false, timeZone: 'Asia/Shanghai'}).format(new Date(result.startedAt)) : '-')}</td>
        <td>${escapeHtml(result.scope ?? '-')}</td>
      </tr>`,
    )
    .join('\n')

const renderFileList = files => `<div class="file-list">${files.map(file => `<code>${escapeHtml(file)}</code>`).join('')}</div>`

const renderTargetRows = targets =>
  targets
    .map(
      target => `<tr>
        <td><code>${escapeHtml(target.id)}</code></td>
        <td>${escapeHtml(target.fileCount)}</td>
        <td class="mono">${escapeHtml(target.command)}</td>
        <td>${renderFileList(target.files)}</td>
      </tr>`,
    )
    .join('\n')

const renderArtifactRows = model => {
  const totalTestFiles = model.coverageSummary.rootTestFiles + model.coverageSummary.browserTestFiles
  const rows = [
    {
      name: '验收报告（本页）',
      value: '自包含 HTML',
      detail: model.generatedAtText,
      action: '查看',
    },
    {
      name: '测试矩阵',
      value: `${model.rootTargets.length} 个根目标`,
      detail: `${totalTestFiles} 个测试文件`,
      action: '查看',
    },
    {
      name: '浏览器覆盖清单',
      value: `${model.browserTargets.length} 个目标`,
      detail: `${model.coverageSummary.browserTestFiles} 个浏览器测试文件`,
      action: '查看',
    },
    {
      name: '未覆盖边界清单',
      value: `${model.coverageSummary.uncoveredBoundaries} 项`,
      detail: '来自 docs/testing/apps-feature-test-matrix.md',
      action: '查看',
    },
    {
      name: '完整提交',
      value: model.metadata.commit,
      detail: model.metadata.fullCommit,
      action: '复制',
    },
    {
      name: '工作区状态',
      value: model.metadata.dirty ? '有改动' : 'clean',
      detail: model.metadata.dirtySummary,
      action: '查看',
    },
  ]

  return rows
    .map(
      row => `<tr>
        <td>${escapeHtml(row.name)}</td>
        <td class="mono">${escapeHtml(row.value)}</td>
        <td>${escapeHtml(row.detail)}</td>
        <td><span class="link-like">${escapeHtml(row.action)}</span></td>
      </tr>`,
    )
    .join('\n')
}

const renderBoundaryRows = boundaries => {
  if (boundaries.length === 0) {
    return '<tr><td colspan="2">当前清单未登记剩余 P2 边界。</td></tr>'
  }
  return boundaries
    .map(
      boundary => `<tr>
        <td><code>${escapeHtml(boundary.subject)}</code></td>
        <td>${escapeHtml(boundary.boundary)}</td>
      </tr>`,
    )
    .join('\n')
}

const renderCoverageRows = targets =>
  targets
    .map(
      target => `<tr>
        <td><code>${escapeHtml(target.id)}</code></td>
        <td>${escapeHtml(target.fileCount)}</td>
        <td class="mono">${escapeHtml(target.command)}</td>
        <td>${renderFileList(target.files)}</td>
      </tr>`,
    )
    .join('\n')

const renderLogSections = commandResults =>
  commandResults
    .filter(result => result.output)
    .map(
      result => `<details class="log">
        <summary><code>${escapeHtml(result.label)}</code> 输出摘要</summary>
        <pre>${escapeHtml(result.output)}</pre>
      </details>`,
    )
    .join('\n')

const renderBrandLogo = brandLogo => {
  if (!brandLogo?.dataUri) {
    return '<div class="brand-logo brand-logo-fallback" aria-label="EMP v4">EMP</div>'
  }
  return `<img class="brand-logo" src="${escapeHtml(brandLogo.dataUri)}" alt="EMP v4">`
}

export const renderAcceptanceReportHtml = model => {
  const overall = model.overallStatus
  const overallClass = getStatusClass(overall)
  const summary = model.commandSummary
  const commandPassRate = summary.total ? `${Math.round((summary.passed / summary.total) * 100)}%` : '-'
  const commandPassRateValue = formatPercentValue(summary.passed, summary.total)
  const totalDurationMs = model.commandResults.reduce((total, result) => total + (Number(result.durationMs) || 0), 0)
  const totalTestFiles = model.coverageSummary.rootTestFiles + model.coverageSummary.browserTestFiles
  const requiredTotal = model.commandResults.filter(result => result.required).length
  const requiredPassed = model.commandResults.filter(result => result.required && result.status === 'passed').length
  const boundaryTone = model.coverageSummary.uncoveredBoundaries > 0 ? 'failed' : 'passed'
  const buildDate = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'Asia/Shanghai',
  })
    .format(new Date(model.generatedAt))
    .replaceAll('-', '')
  const buildId = `${buildDate}.${model.metadata.commit.slice(0, 4)}`
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(model.title)}</title>
  <style>
    :root {
      color-scheme: light;
      --background: #f6f7f8;
      --foreground: #171717;
      --card: #ffffff;
      --muted: #68707f;
      --muted-foreground: #4e5664;
      --border: #dde2e8;
      --border-strong: #c9d0da;
      --primary: #111111;
      --primary-foreground: #ffffff;
      --success: #177245;
      --success-soft: #eaf7ef;
      --warning: #b56503;
      --warning-soft: #fff4df;
      --destructive: #d92d20;
      --destructive-soft: #fff0ee;
      --accent: #0f766e;
      --accent-soft: #e7f5f3;
      --violet: #6d5dfc;
      --violet-soft: #f0efff;
      --shadow: 0 18px 50px rgb(17 17 17 / 0.08);
    }
    * { box-sizing: border-box; }
    html { background: var(--background); color: var(--foreground); font-family: Geist, Satoshi, "Cabinet Grotesk", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; background: var(--background); font-size: 14px; line-height: 1.45; overflow-x: hidden; }
    h1, h2, h3, p { margin: 0; letter-spacing: 0; }
    h1 { font-size: 34px; line-height: 1.08; font-weight: 820; }
    h2 { font-size: 18px; line-height: 1.2; font-weight: 760; }
    h3 { font-size: 14px; line-height: 1.25; font-weight: 740; }
    .acceptance-dashboard { min-height: 100vh; display: grid; grid-template-columns: 286px minmax(0, 1fr); background: var(--background); }
    .dashboard-sidebar { min-width: 0; padding: 20px 18px; display: flex; flex-direction: column; gap: 18px; background: #111111; color: var(--primary-foreground); border-right: 1px solid #252525; }
    .brand-heading { display: flex; align-items: center; gap: 12px; min-width: 0; }
    .brand-logo { width: 52px; height: 52px; flex: 0 0 52px; border: 1px solid rgb(255 255 255 / 0.16); border-radius: 8px; object-fit: cover; background: #ffffff; }
    .brand-logo-fallback { display: grid; place-items: center; color: var(--foreground); font-weight: 820; }
    .brand-copy { min-width: 0; }
    .brand-title { font-size: 18px; line-height: 1.1; font-weight: 820; }
    .brand-description { margin-top: 3px; color: rgb(255 255 255 / 0.62); font-size: 12px; font-weight: 650; }
    .sidebar-nav { display: grid; gap: 7px; }
    .sidebar-link { display: flex; align-items: center; justify-content: space-between; gap: 10px; padding: 9px 10px; border: 1px solid rgb(255 255 255 / 0.08); border-radius: 8px; color: rgb(255 255 255 / 0.78); text-decoration: none; font-size: 13px; font-weight: 680; }
    .sidebar-link strong { color: #ffffff; font-family: "Geist Mono", "JetBrains Mono", "SFMono-Regular", Consolas, monospace; font-size: 12px; }
    .sidebar-card { margin-top: auto; padding: 14px; border: 1px solid rgb(255 255 255 / 0.12); border-radius: 8px; background: rgb(255 255 255 / 0.06); display: grid; gap: 10px; }
    .sidebar-card span { color: rgb(255 255 255 / 0.64); font-size: 12px; }
    .sidebar-status { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .sidebar-status strong { font-size: 26px; line-height: 1; }
    .status-word-passed { color: #5bd286; }
    .status-word-failed { color: #ff7066; }
    .status-word-skipped { color: #ffc15a; }
    .dashboard-shell { min-width: 0; padding: 24px; display: flex; flex-direction: column; gap: 16px; }
    .dashboard-hero { display: grid; grid-template-columns: minmax(0, 1fr) 332px; gap: 16px; align-items: stretch; }
    .hero-copy, .hero-status, .metric-card, .dashboard-card { border: 1px solid var(--border); border-radius: 8px; background: var(--card); box-shadow: var(--shadow); }
    .hero-copy { min-width: 0; padding: 22px; display: flex; flex-direction: column; gap: 14px; }
    .eyebrow { color: var(--accent); font-family: "Geist Mono", "JetBrains Mono", "SFMono-Regular", Consolas, monospace; font-size: 12px; font-weight: 780; text-transform: uppercase; }
    .hero-copy p { max-width: 780px; color: var(--muted-foreground); font-size: 14px; }
    .hero-status { padding: 18px; display: grid; align-content: space-between; gap: 18px; }
    .hero-status-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 12px; }
    .status-emblem { width: 54px; height: 54px; display: grid; place-items: center; border-radius: 8px; color: var(--primary-foreground); font-size: 30px; line-height: 1; font-weight: 860; }
    .status-emblem.passed { background: var(--success); }
    .status-emblem.failed { background: var(--destructive); }
    .status-emblem.skipped { background: var(--warning); }
    .hero-status-word { font-size: 36px; line-height: 1; font-weight: 860; }
    .hero-status small { color: var(--muted); font-size: 12px; }
    .status-counts { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
    .status-counts div { padding: 9px; border: 1px solid var(--border); border-radius: 8px; background: var(--background); }
    .status-counts span { display: block; color: var(--muted); font-size: 12px; }
    .status-counts strong { display: block; margin-top: 4px; font-family: "Geist Mono", "JetBrains Mono", "SFMono-Regular", Consolas, monospace; font-size: 20px; line-height: 1; }
    .meta-strip { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 10px; }
    .meta-item { min-width: 0; padding: 12px 14px; border: 1px solid var(--border); border-radius: 8px; background: var(--card); }
    .meta-label { color: var(--muted); font-size: 12px; margin-bottom: 5px; }
    .meta-value { font-weight: 710; overflow-wrap: anywhere; }
    .dashboard-grid { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 14px; }
    .metric-card { min-width: 0; padding: 16px; display: grid; gap: 12px; }
    .metric-card-header { display: flex; align-items: center; justify-content: space-between; gap: 10px; }
    .metric-label { color: var(--muted); font-size: 12px; font-weight: 720; }
    .metric-value { font-family: "Geist Mono", "JetBrains Mono", "SFMono-Regular", Consolas, monospace; font-size: 30px; line-height: 1; font-weight: 820; }
    .metric-sub { color: var(--muted-foreground); font-size: 12px; }
    .metric-progress { height: 8px; border-radius: 999px; background: var(--background); overflow: hidden; }
    .metric-progress span { display: block; width: var(--progress); height: 100%; border-radius: inherit; background: var(--accent); }
    .metric-card-passed .metric-value, .metric-card-passed .metric-icon { color: var(--success); }
    .metric-card-failed .metric-value, .metric-card-failed .metric-icon { color: var(--destructive); }
    .metric-card-skipped .metric-value, .metric-card-skipped .metric-icon { color: var(--warning); }
    .metric-card-accent .metric-value, .metric-card-accent .metric-icon { color: var(--accent); }
    .metric-card-violet .metric-value, .metric-card-violet .metric-icon { color: var(--violet); }
    .metric-icon { width: 26px; height: 26px; display: grid; place-items: center; border: 1px solid currentColor; border-radius: 8px; font-size: 13px; font-weight: 820; }
    .dashboard-main-grid { display: grid; grid-template-columns: minmax(420px, 1.06fr) minmax(360px, 0.94fr); gap: 14px; align-items: start; }
    .dashboard-card { min-width: 0; overflow: hidden; }
    .dashboard-card-header { padding: 15px 16px 12px; border-bottom: 1px solid var(--border); display: flex; align-items: flex-start; justify-content: space-between; gap: 14px; }
    .dashboard-card-description { margin-top: 4px; color: var(--muted); font-size: 12px; }
    .dashboard-card-content { min-width: 0; padding: 14px 16px 16px; }
    .chart-card .dashboard-card-content { padding-top: 10px; }
    .command-distribution { width: 100%; height: auto; display: block; color: var(--muted); }
    .chart-track { fill: var(--background); }
    .chart-segment, .chart-dot { shape-rendering: geometricPrecision; }
    .chart-passed { fill: var(--success); }
    .chart-skipped { fill: var(--warning); }
    .chart-failed { fill: var(--destructive); }
    .chart-axis text, .chart-legend text { fill: var(--muted-foreground); font-size: 12px; font-family: "Geist Mono", "JetBrains Mono", "SFMono-Regular", Consolas, monospace; }
    .table-scroll { width: 100%; overflow-x: auto; }
    .dashboard-table { width: 100%; min-width: 760px; border-collapse: separate; border-spacing: 0; table-layout: fixed; }
    .dashboard-table th, .dashboard-table td { border-bottom: 1px solid var(--border); padding: 10px 12px; text-align: left; vertical-align: top; overflow-wrap: anywhere; }
    .dashboard-table th { color: var(--muted); background: var(--background); font-size: 12px; font-weight: 740; }
    .dashboard-table tbody tr:last-child td { border-bottom: 0; }
    .dashboard-table tbody tr:hover td { background: #fbfcfd; }
    .command-table th:nth-child(1) { width: 52px; }
    .command-table th:nth-child(2) { width: 28%; }
    .command-table th:nth-child(3) { width: 98px; }
    .command-table th:nth-child(4) { width: 80px; }
    .command-table th:nth-child(5) { width: 92px; }
    .command-table th:nth-child(6) { width: 102px; }
    .artifact-table th:nth-child(1) { width: 26%; }
    .artifact-table th:nth-child(2) { width: 18%; }
    .artifact-table th:nth-child(3) { width: 40%; }
    .matrix-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; align-items: start; }
    .test-matrix, .coverage-table, .boundary-table { min-width: 860px; }
    code, .mono { font-family: "Geist Mono", "JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 12px; }
    code { color: var(--accent); }
    .release-badge { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 64px; border-radius: 999px; padding: 4px 9px; font-weight: 740; font-size: 12px; border: 1px solid currentColor; white-space: nowrap; }
    .release-badge-dot { width: 7px; height: 7px; border-radius: 999px; background: currentColor; }
    .release-badge-passed { color: var(--success); background: var(--success-soft); }
    .release-badge-failed { color: var(--destructive); background: var(--destructive-soft); }
    .release-badge-skipped { color: var(--warning); background: var(--warning-soft); }
    .step-index { display: inline-grid; place-items: center; width: 24px; height: 24px; border-radius: 8px; color: var(--primary-foreground); font-family: "Geist Mono", "JetBrains Mono", "SFMono-Regular", Consolas, monospace; font-size: 12px; font-weight: 760; }
    .step-passed { background: var(--success); }
    .step-failed { background: var(--destructive); }
    .step-skipped { background: var(--warning); }
    .command-name { display: flex; flex-direction: column; gap: 4px; min-width: 0; }
    .command-name span { color: var(--muted); font-family: "Geist Mono", "JetBrains Mono", "SFMono-Regular", Consolas, monospace; font-size: 11px; overflow-wrap: anywhere; }
    .file-list { max-height: 118px; overflow: auto; display: grid; gap: 4px; padding-right: 4px; -webkit-overflow-scrolling: touch; }
    .file-list code { display: block; line-height: 1.4; }
    .link-like { color: var(--accent); font-weight: 720; }
    .log { border-top: 1px solid var(--border); overflow: hidden; }
    .log summary { cursor: pointer; padding: 10px 12px; background: var(--background); font-weight: 680; }
    pre { margin: 0; padding: 12px; white-space: pre-wrap; overflow-wrap: anywhere; background: #111111; color: #f4f6f8; font-size: 12px; line-height: 1.5; }
    footer { color: var(--muted); font-size: 12px; }
    @media (max-width: 1180px) {
      .acceptance-dashboard { grid-template-columns: 1fr; }
      .dashboard-sidebar { border-right: 0; border-bottom: 1px solid #252525; }
      .sidebar-card { margin-top: 0; }
      .sidebar-nav { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .dashboard-main-grid, .matrix-grid { grid-template-columns: 1fr; }
    }
    @media (max-width: 860px) {
      .dashboard-shell { padding: 14px; }
      .dashboard-hero, .dashboard-grid, .meta-strip { grid-template-columns: 1fr; }
      .hero-copy, .hero-status, .metric-card, .dashboard-card { box-shadow: none; }
      h1 { font-size: 28px; }
      .hero-status-word { font-size: 31px; }
      .status-counts { grid-template-columns: 1fr; }
      .sidebar-nav { grid-template-columns: 1fr; }
      .dashboard-table { table-layout: auto; }
    }
  </style>
</head>
<body>
  <main class="acceptance-dashboard">
    <aside class="dashboard-sidebar" aria-label="发布验收导航">
      <div class="brand-heading">
        ${renderBrandLogo(model.brandLogo)}
        <div class="brand-copy">
          <div class="brand-title">EMP v4</div>
          <div class="brand-description">Release Acceptance</div>
        </div>
      </div>
      <nav class="sidebar-nav">
        <a class="sidebar-link" href="#overview">总体状态 <strong>${escapeHtml(overallText[overall])}</strong></a>
        <a class="sidebar-link" href="#commands">验证命令 <strong>${escapeHtml(summary.total)}</strong></a>
        <a class="sidebar-link" href="#artifacts">产物证据 <strong>HTML</strong></a>
        <a class="sidebar-link" href="#matrix">测试矩阵 <strong>${escapeHtml(totalTestFiles)}</strong></a>
        <a class="sidebar-link" href="#coverage">新增覆盖 <strong>${escapeHtml(model.browserTargets.length)}</strong></a>
        <a class="sidebar-link" href="#boundaries">未覆盖边界 <strong>${escapeHtml(model.coverageSummary.uncoveredBoundaries)}</strong></a>
      </nav>
      <div class="sidebar-card">
        <span>发布门禁</span>
        <div class="sidebar-status">
          <strong class="status-word-${escapeHtml(overallClass)}">${escapeHtml(overallText[overall])}</strong>
          ${renderStatusBadge(overall === 'warning' ? 'skipped' : overall)}
        </div>
        <span>${escapeHtml(getGateSubtext(overall))}</span>
      </div>
    </aside>

    <section class="dashboard-shell">
      <header class="dashboard-hero" id="overview">
        <div class="hero-copy">
          <div class="eyebrow">Release Command Center</div>
          <h1>${escapeHtml(model.title)}</h1>
          <p>面向 EMP v4 发版的验收 dashboard，汇总 workflow、CI、构建、apps 验收、dry-run、浏览器覆盖、产物证据和剩余边界。</p>
        </div>
        <aside class="hero-status" aria-label="发布验收总体状态">
          <div class="hero-status-top">
            <div>
              <small>发布验收总体状态</small>
              <div class="hero-status-word status-word-${escapeHtml(overallClass)}">${escapeHtml(overallText[overall])}</div>
            </div>
            <div class="status-emblem ${escapeHtml(overallClass)}">!</div>
          </div>
          <div class="status-counts">
            <div><span>通过</span><strong>${escapeHtml(summary.passed)}</strong></div>
            <div><span>跳过</span><strong>${escapeHtml(summary.skipped)}</strong></div>
            <div><span>失败</span><strong>${escapeHtml(summary.failed)}</strong></div>
          </div>
        </aside>
      </header>

      <section class="meta-strip" aria-label="发布元信息">
        <div class="meta-item"><div class="meta-label">版本/标签</div><div class="meta-value">${escapeHtml(model.metadata.version)}</div></div>
        <div class="meta-item"><div class="meta-label">提交</div><div class="meta-value">${escapeHtml(model.metadata.commit)}</div></div>
        <div class="meta-item"><div class="meta-label">分支</div><div class="meta-value">${escapeHtml(model.metadata.branch)}</div></div>
        <div class="meta-item"><div class="meta-label">构建号</div><div class="meta-value">${escapeHtml(buildId)}</div></div>
        <div class="meta-item"><div class="meta-label">验收时间</div><div class="meta-value">${escapeHtml(model.generatedAtText)}</div></div>
      </section>

      <section class="dashboard-grid" aria-label="核心指标">
        <article class="metric-card metric-card-${escapeHtml(overallClass)}">
          <div class="metric-card-header"><span class="metric-label">发布门禁</span><span class="metric-icon">!</span></div>
          <div class="metric-value">${escapeHtml(overallText[overall])}</div>
          <div class="metric-sub">${escapeHtml(getGateSubtext(overall))}</div>
        </article>
        <article class="metric-card metric-card-${escapeHtml(overallClass)}">
          <div class="metric-card-header"><span class="metric-label">命令通过率</span><span class="metric-icon">%</span></div>
          <div class="metric-value">${escapeHtml(commandPassRate)}</div>
          <div class="metric-progress"><span style="--progress: ${escapeHtml(commandPassRateValue)}%"></span></div>
          <div class="metric-sub">${escapeHtml(summary.passed)} / ${escapeHtml(summary.total)} 通过</div>
        </article>
        <article class="metric-card metric-card-accent">
          <div class="metric-card-header"><span class="metric-label">测试文件总数</span><span class="metric-icon">T</span></div>
          <div class="metric-value">${escapeHtml(totalTestFiles)}</div>
          <div class="metric-sub">root ${escapeHtml(model.coverageSummary.rootTestFiles)} / browser ${escapeHtml(model.coverageSummary.browserTestFiles)}</div>
        </article>
        <article class="metric-card metric-card-${escapeHtml(boundaryTone)}">
          <div class="metric-card-header"><span class="metric-label">未覆盖边界</span><span class="metric-icon">B</span></div>
          <div class="metric-value">${escapeHtml(model.coverageSummary.uncoveredBoundaries)}</div>
          <div class="metric-sub">来自 apps 功能测试矩阵</div>
        </article>
      </section>

      <section class="dashboard-main-grid">
        <article class="dashboard-card chart-card">
          <div class="dashboard-card-header">
            <div>
              <h2>命令结果分布</h2>
              <div class="dashboard-card-description">必需门禁 ${escapeHtml(requiredPassed)} / ${escapeHtml(requiredTotal)} 通过，累计耗时 ${escapeHtml(formatDuration(totalDurationMs))}</div>
            </div>
            ${renderStatusBadge(overall === 'warning' ? 'skipped' : overall)}
          </div>
          <div class="dashboard-card-content">
            ${renderCommandDistribution(summary)}
          </div>
        </article>

        <article class="dashboard-card" id="artifacts">
          <div class="dashboard-card-header">
            <div>
              <h2>产物证据</h2>
              <div class="dashboard-card-description">发布凭证、测试矩阵、浏览器覆盖和工作区状态</div>
            </div>
            <span class="release-badge release-badge-skipped">自包含</span>
          </div>
          <div class="table-scroll">
            <table class="dashboard-table artifact-table">
              <thead><tr><th>产物</th><th>数值</th><th>说明</th><th>操作</th></tr></thead>
              <tbody>${renderArtifactRows(model)}</tbody>
            </table>
          </div>
        </article>
      </section>

      <article class="dashboard-card" id="commands">
        <div class="dashboard-card-header">
          <div>
            <h2>验证命令</h2>
            <div class="dashboard-card-description">每次发版的真实命令执行状态和输出摘要</div>
          </div>
          <span class="release-badge release-badge-skipped">${escapeHtml(summary.total)} 条</span>
        </div>
        <div class="table-scroll">
          <table class="dashboard-table command-table">
            <thead>
              <tr><th>#</th><th>命令</th><th>状态</th><th>门禁</th><th>耗时</th><th>开始时间</th><th>范围</th></tr>
            </thead>
            <tbody>${renderCommandRows(model.commandResults)}</tbody>
          </table>
        </div>
        ${renderLogSections(model.commandResults)}
      </article>

      <article class="dashboard-card" id="matrix">
        <div class="dashboard-card-header">
          <div>
            <h2>测试矩阵</h2>
            <div class="dashboard-card-description">root-test-targets 登记的根测试目标</div>
          </div>
          <span class="release-badge release-badge-passed">${escapeHtml(model.coverageSummary.rootTargets)} targets</span>
        </div>
        <div class="table-scroll">
          <table class="dashboard-table test-matrix">
            <thead><tr><th>目标</th><th>文件数</th><th>命令</th><th>测试文件</th></tr></thead>
            <tbody>${renderTargetRows(model.rootTargets)}</tbody>
          </table>
        </div>
      </article>

      <section class="matrix-grid">
        <article class="dashboard-card" id="coverage">
          <div class="dashboard-card-header">
            <div>
              <h2>新增覆盖</h2>
              <div class="dashboard-card-description">apps 与 packages 的浏览器验收目标</div>
            </div>
            <span class="release-badge release-badge-passed">${escapeHtml(model.browserTargets.length)} targets</span>
          </div>
          <div class="table-scroll">
            <table class="dashboard-table coverage-table">
              <thead><tr><th>目标</th><th>文件数</th><th>命令</th><th>测试文件</th></tr></thead>
              <tbody>${renderCoverageRows(model.browserTargets)}</tbody>
            </table>
          </div>
        </article>

        <article class="dashboard-card" id="boundaries">
          <div class="dashboard-card-header">
            <div>
              <h2>未覆盖边界</h2>
              <div class="dashboard-card-description">仍需关注的 apps P2 边界</div>
            </div>
            <span class="release-badge release-badge-${escapeHtml(boundaryTone)}">${escapeHtml(model.coverageSummary.uncoveredBoundaries)} 项</span>
          </div>
          <div class="table-scroll">
            <table class="dashboard-table boundary-table">
              <thead><tr><th>对象</th><th>边界描述</th></tr></thead>
              <tbody>${renderBoundaryRows(model.uncoveredBoundaries)}</tbody>
            </table>
          </div>
        </article>
      </section>

      <footer>生成器：<code>scripts/release-acceptance-report.mjs</code>。默认输出：<code>${escapeHtml(defaultOutputFile)}</code>。</footer>
    </section>
  </main>
</body>
</html>
`
}

export const writeAcceptanceReport = async ({repoRoot = repoRootFromModule, outputFile = defaultOutputFile, model}) => {
  const absoluteOutputFile = path.isAbsolute(outputFile) ? outputFile : path.join(repoRoot, outputFile)
  await mkdir(path.dirname(absoluteOutputFile), {recursive: true})
  await writeFile(absoluteOutputFile, renderAcceptanceReportHtml(model), 'utf8')
  return absoluteOutputFile
}

const trimOutput = output => {
  const maxLength = 12000
  if (output.length <= maxLength) return output
  return `${output.slice(0, 6000)}\n\n... output truncated ...\n\n${output.slice(-4000)}`
}

export const runAcceptanceCommand = (spec, {repoRoot = repoRootFromModule, dryRun = false, skipped = false} = {}) =>
  new Promise(resolve => {
    const startedAt = new Date().toISOString()
    const startedMs = Date.now()
    const command = formatCommand(spec.command)

    if (dryRun || skipped) {
      const endedAt = new Date().toISOString()
      resolve({
        id: spec.id,
        label: spec.label,
        command,
        scope: spec.scope,
        required: spec.required,
        status: 'skipped',
        exitCode: null,
        durationMs: 0,
        startedAt,
        endedAt,
        output: dryRun ? 'dry-run: command was not executed' : `skipped: run with ${spec.runFlag ?? '--include'} to execute`,
      })
      return
    }

    const child = spawn(spec.command[0], spec.command.slice(1), {cwd: repoRoot, env: process.env})
    let output = ''
    child.stdout.on('data', chunk => {
      process.stdout.write(chunk)
      output += chunk.toString()
    })
    child.stderr.on('data', chunk => {
      process.stderr.write(chunk)
      output += chunk.toString()
    })
    child.on('error', error => {
      const endedAt = new Date().toISOString()
      resolve({
        id: spec.id,
        label: spec.label,
        command,
        scope: spec.scope,
        required: spec.required,
        status: 'failed',
        exitCode: 1,
        durationMs: Date.now() - startedMs,
        startedAt,
        endedAt,
        output: trimOutput(`${output}\n${error.message}`),
      })
    })
    child.on('exit', code => {
      const endedAt = new Date().toISOString()
      resolve({
        id: spec.id,
        label: spec.label,
        command,
        scope: spec.scope,
        required: spec.required,
        status: code === 0 ? 'passed' : 'failed',
        exitCode: code ?? 1,
        durationMs: Date.now() - startedMs,
        startedAt,
        endedAt,
        output: trimOutput(output),
      })
    })
  })

const parseArgs = args => {
  const options = {
    out: defaultOutputFile,
    dryRun: false,
    includeBrowser: false,
    skippedCommands: new Set(),
  }

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--') {
      continue
    } else if (arg === '--out') {
      options.out = args[index + 1]
      index += 1
    } else if (arg === '--dry-run') {
      options.dryRun = true
    } else if (arg === '--include-browser') {
      options.includeBrowser = true
    } else if (arg === '--skip-command') {
      options.skippedCommands.add(args[index + 1])
      index += 1
    } else if (arg === '--help' || arg === '-h') {
      options.help = true
    } else {
      throw new Error(`Unknown argument: ${arg}`)
    }
  }

  return options
}

const printHelp = () => {
  console.log(`Usage: node scripts/release-acceptance-report.mjs [options]

Options:
  --out <file>          Output HTML path. Default: ${defaultOutputFile}
  --dry-run             Generate the HTML shape without running commands.
  --include-browser     Include optional test:apps:browser lane.
  --skip-command <id>   Skip a command by id. Repeatable.
`)
}

export const runAcceptanceReportCli = async ({repoRoot = repoRootFromModule, argv = process.argv.slice(2)} = {}) => {
  const options = parseArgs(argv)
  if (options.help) {
    printHelp()
    return {exitCode: 0}
  }

  const commandResults = []
  for (const spec of DEFAULT_ACCEPTANCE_COMMANDS) {
    const skipped = options.skippedCommands.has(spec.id) || (spec.id === 'apps-browser' && !options.includeBrowser)
    commandResults.push(await runAcceptanceCommand(spec, {repoRoot, dryRun: options.dryRun, skipped}))
  }

  const model = buildAcceptanceReportModel({repoRoot, commandResults})
  const outputFile = await writeAcceptanceReport({repoRoot, outputFile: options.out, model})

  console.log(`Release acceptance report: ${outputFile}`)
  console.log(`Overall status: ${overallText[model.overallStatus]}`)

  return {exitCode: model.overallStatus === 'failed' ? 1 : 0, outputFile, model}
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runAcceptanceReportCli()
    .then(result => {
      process.exitCode = result.exitCode
    })
    .catch(error => {
      console.error(error.message)
      process.exitCode = 1
    })
}
