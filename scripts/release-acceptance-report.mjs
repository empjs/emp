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
  `<span class="status status-${escapeHtml(status)}"><span class="dot"></span>${escapeHtml(statusText[status] ?? status)}</span>`

const renderCommandRows = commandResults =>
  commandResults
    .map(
      result => `<tr>
        <td><code>${escapeHtml(result.label)}</code></td>
        <td>${renderStatusBadge(result.status)}</td>
        <td>${escapeHtml(result.required ? '必需' : '可选')}</td>
        <td>${escapeHtml(formatDuration(result.durationMs))}</td>
        <td>${escapeHtml(result.exitCode ?? '-')}</td>
        <td class="mono">${escapeHtml(result.command)}</td>
        <td>${escapeHtml(result.scope ?? '-')}</td>
      </tr>`,
    )
    .join('\n')

const renderTargetRows = targets =>
  targets
    .map(
      target => `<tr>
        <td><code>${escapeHtml(target.id)}</code></td>
        <td>${escapeHtml(target.fileCount)}</td>
        <td class="mono">${escapeHtml(target.command)}</td>
        <td>${target.files.map(file => `<code>${escapeHtml(file)}</code>`).join('<br>')}</td>
      </tr>`,
    )
    .join('\n')

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

const renderBrandLockup = title => `<div class="brand-lockup">
        <svg class="brand-mark" viewBox="0 0 64 64" role="img" aria-label="EMP v4" focusable="false">
          <title>EMP v4</title>
          <rect class="brand-mark-bg" x="3" y="3" width="58" height="58" rx="14" fill="#0f172a"></rect>
          <path class="brand-mark-grid" d="M12 16h40M12 48h40M16 12v40M48 12v40"></path>
          <text class="brand-mark-text" x="32" y="31" text-anchor="middle">EMP</text>
          <rect class="brand-mark-chip" x="21" y="38" width="22" height="12" rx="6"></rect>
          <text class="brand-mark-version" x="32" y="48" text-anchor="middle">v4</text>
        </svg>
        <div class="brand-copy">
          <div class="brand-kicker">EMP V4</div>
          <h1>${escapeHtml(title)}</h1>
          <div class="brand-subtitle">Release acceptance evidence / REPORT</div>
        </div>
      </div>`

export const renderAcceptanceReportHtml = model => {
  const overall = model.overallStatus
  const summary = model.commandSummary
  return `<!doctype html>
<html lang="zh-CN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(model.title)}</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #ffffff;
      --ink: #111827;
      --muted: #667085;
      --line: #d9dee8;
      --soft: #f6f8fb;
      --soft-strong: #eef2f7;
      --accent: #0f766e;
      --accent-strong: #115e59;
      --accent-soft: #e7f7f4;
      --green: #16803c;
      --green-bg: #eaf7ef;
      --amber: #b76a00;
      --amber-bg: #fff6df;
      --red: #cc1f1a;
      --red-bg: #fff0ef;
      --shadow: 0 10px 28px rgba(16, 24, 40, 0.08);
    }
    * { box-sizing: border-box; }
    html { background: var(--bg); color: var(--ink); font-family: Geist, Satoshi, "Cabinet Grotesk", ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
    body { margin: 0; background: var(--bg); font-size: 14px; line-height: 1.5; }
    main { width: min(1440px, 100%); margin: 0 auto; padding: 28px 32px 40px; }
    header { display: grid; grid-template-columns: minmax(0, 1fr) minmax(320px, 360px); gap: 24px; align-items: start; border-bottom: 1px solid var(--line); padding-bottom: 22px; }
    h1 { margin: 2px 0 6px; font-size: clamp(28px, 3vw, 42px); line-height: 1.08; font-weight: 780; letter-spacing: 0; }
    h2 { margin: 0 0 12px; font-size: 18px; line-height: 1.25; font-weight: 720; letter-spacing: 0; }
    h3 { margin: 0 0 10px; font-size: 15px; line-height: 1.25; font-weight: 720; letter-spacing: 0; }
    .brand-lockup { display: flex; align-items: center; gap: 16px; min-width: 0; margin-bottom: 18px; }
    .brand-mark { width: 72px; height: 72px; flex: 0 0 72px; filter: drop-shadow(0 10px 18px rgba(15, 118, 110, 0.18)); }
    .brand-mark-bg { fill: #0f172a; stroke: rgba(15, 118, 110, 0.58); stroke-width: 2; }
    .brand-mark-grid { fill: none; stroke: rgba(45, 212, 191, 0.32); stroke-width: 1; stroke-linecap: round; }
    .brand-mark-text { fill: #f8fafc; font-family: Geist, Satoshi, "Cabinet Grotesk", ui-sans-serif, system-ui, sans-serif; font-size: 15px; font-weight: 820; }
    .brand-mark-chip { fill: #2dd4bf; }
    .brand-mark-version { fill: #0f172a; font-family: Geist, Satoshi, "Cabinet Grotesk", ui-sans-serif, system-ui, sans-serif; font-size: 10px; font-weight: 820; }
    .brand-copy { min-width: 0; }
    .brand-kicker { color: var(--accent-strong); font-size: 12px; font-weight: 820; letter-spacing: 0; }
    .brand-subtitle { color: var(--muted); font-size: 13px; font-weight: 640; overflow-wrap: anywhere; }
    .meta-grid { display: grid; grid-template-columns: repeat(6, minmax(100px, 1fr)); gap: 14px; }
    .meta-label { color: var(--muted); font-size: 12px; margin-bottom: 4px; }
    .meta-value { font-weight: 680; overflow-wrap: anywhere; }
    .status-card { border: 1px solid var(--line); border-radius: 8px; box-shadow: var(--shadow); padding: 18px; background: #fff; }
    .status-card .overall { display: flex; align-items: center; gap: 14px; }
    .shield { width: 56px; height: 56px; border-radius: 8px; display: grid; place-items: center; color: #fff; font-size: 30px; font-weight: 800; }
    .shield.passed { background: var(--green); }
    .shield.failed { background: var(--red); }
    .shield.skipped, .shield.warning { background: var(--amber); }
    .overall-text { font-size: 34px; line-height: 1; font-weight: 820; }
    .overall-text.passed { color: var(--green); }
    .overall-text.failed { color: var(--red); }
    .overall-text.skipped, .overall-text.warning { color: var(--amber); }
    .summary-list { margin-top: 16px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
    .summary-list div { background: var(--soft); border: 1px solid var(--line); border-radius: 8px; padding: 8px 10px; }
    .summary-list span { display: block; color: var(--muted); font-size: 12px; }
    .summary-list strong { font-size: 18px; }
    .metric-strip { display: grid; grid-template-columns: repeat(6, 1fr); border: 1px solid var(--line); margin: 22px 0; }
    .metric { padding: 18px; border-right: 1px solid var(--line); min-width: 0; }
    .metric:last-child { border-right: 0; }
    .metric span { display: block; color: var(--muted); font-size: 12px; }
    .metric strong { display: block; margin-top: 6px; font-size: 28px; line-height: 1.1; }
    .grid { display: grid; grid-template-columns: 1.04fr 0.96fr; gap: 24px; align-items: start; }
    section { margin-top: 22px; }
    .panel { border: 1px solid var(--line); border-radius: 8px; background: #fff; overflow: hidden; }
    .panel-head { display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 14px 16px; background: var(--soft); border-bottom: 1px solid var(--line); }
    .panel-body { padding: 16px; overflow-x: auto; }
    table { width: 100%; border-collapse: collapse; table-layout: fixed; }
    th, td { border: 1px solid var(--line); padding: 10px 12px; text-align: left; vertical-align: top; }
    th { background: var(--soft); color: #344054; font-size: 12px; font-weight: 720; }
    td { background: #fff; }
    code, .mono { font-family: "Geist Mono", "JetBrains Mono", "SFMono-Regular", Consolas, "Liberation Mono", monospace; font-size: 12px; }
    code { color: var(--accent-strong); }
    .status { display: inline-flex; align-items: center; justify-content: center; gap: 6px; min-width: 62px; border-radius: 7px; padding: 4px 8px; font-weight: 720; font-size: 12px; border: 1px solid currentColor; }
    .dot { width: 7px; height: 7px; border-radius: 999px; background: currentColor; }
    .status-passed { color: var(--green); background: var(--green-bg); }
    .status-failed { color: var(--red); background: var(--red-bg); }
    .status-skipped { color: var(--amber); background: var(--amber-bg); }
    .callout { border-left: 4px solid var(--accent); background: var(--accent-soft); padding: 12px 14px; color: #164e4a; }
    .log { border: 1px solid var(--line); border-radius: 8px; margin-top: 10px; overflow: hidden; }
    .log summary { cursor: pointer; padding: 10px 12px; background: var(--soft); font-weight: 680; }
    pre { margin: 0; padding: 12px; white-space: pre-wrap; overflow-wrap: anywhere; background: #0f172a; color: #e5edf9; font-size: 12px; line-height: 1.55; }
    footer { color: var(--muted); margin-top: 24px; font-size: 12px; }
    @media (prefers-reduced-motion: no-preference) {
      .brand-mark { animation: brand-enter 480ms ease-out both; }
      @keyframes brand-enter {
        from { transform: translateY(6px) scale(0.96); }
        to { transform: translateY(0) scale(1); }
      }
    }
    @media (max-width: 980px) {
      main { padding: 20px 16px 32px; }
      header, .grid { grid-template-columns: 1fr; }
      .meta-grid, .metric-strip { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .metric { border-bottom: 1px solid var(--line); }
      .metric:nth-child(2n) { border-right: 0; }
      .summary-list { grid-template-columns: repeat(2, 1fr); }
      table { table-layout: auto; min-width: 760px; }
    }
  </style>
</head>
<body>
  <main>
    <header>
      <div>
        ${renderBrandLockup(model.title)}
        <div class="meta-grid">
          <div><div class="meta-label">版本</div><div class="meta-value">${escapeHtml(model.metadata.version)}</div></div>
          <div><div class="meta-label">提交</div><div class="meta-value">${escapeHtml(model.metadata.commit)}</div></div>
          <div><div class="meta-label">分支</div><div class="meta-value">${escapeHtml(model.metadata.branch)}</div></div>
          <div><div class="meta-label">生成时间</div><div class="meta-value">${escapeHtml(model.generatedAtText)}</div></div>
          <div><div class="meta-label">工作区</div><div class="meta-value">${escapeHtml(model.metadata.dirty ? '有改动' : 'clean')}</div></div>
          <div><div class="meta-label">项目</div><div class="meta-value">${escapeHtml(model.metadata.project)}</div></div>
        </div>
      </div>
      <aside class="status-card" aria-label="发布验收总体状态">
        <div class="overall">
          <div class="shield ${escapeHtml(overall)}">!</div>
          <div>
            <div class="meta-label">发布验收总体状态</div>
            <div class="overall-text ${escapeHtml(overall)}">${escapeHtml(overallText[overall])}</div>
          </div>
        </div>
        <div class="summary-list">
          <div><span>通过</span><strong>${escapeHtml(summary.passed)}</strong></div>
          <div><span>失败</span><strong>${escapeHtml(summary.failed)}</strong></div>
          <div><span>跳过</span><strong>${escapeHtml(summary.skipped)}</strong></div>
          <div><span>总计</span><strong>${escapeHtml(summary.total)}</strong></div>
        </div>
      </aside>
    </header>

    <section class="metric-strip" aria-label="总体状态">
      <div class="metric"><span>根测试目标</span><strong>${escapeHtml(model.coverageSummary.rootTargets)}</strong></div>
      <div class="metric"><span>浏览器目标</span><strong>${escapeHtml(model.coverageSummary.browserTargets)}</strong></div>
      <div class="metric"><span>根测试文件</span><strong>${escapeHtml(model.coverageSummary.rootTestFiles)}</strong></div>
      <div class="metric"><span>浏览器测试文件</span><strong>${escapeHtml(model.coverageSummary.browserTestFiles)}</strong></div>
      <div class="metric"><span>命令通过率</span><strong>${escapeHtml(summary.total ? `${Math.round((summary.passed / summary.total) * 100)}%` : '-')}</strong></div>
      <div class="metric"><span>未覆盖边界</span><strong>${escapeHtml(model.coverageSummary.uncoveredBoundaries)}</strong></div>
    </section>

    <div class="grid">
      <section class="panel">
        <div class="panel-head"><h2>验证命令</h2><span>${escapeHtml(summary.total)} 条</span></div>
        <div class="panel-body">
          <table>
            <thead>
              <tr><th>命令</th><th>状态</th><th>门禁</th><th>耗时</th><th>退出码</th><th>实际命令</th><th>范围</th></tr>
            </thead>
            <tbody>${renderCommandRows(model.commandResults)}</tbody>
          </table>
          ${renderLogSections(model.commandResults)}
        </div>
      </section>

      <section class="panel">
        <div class="panel-head"><h2>产物证据</h2><span>自包含 HTML</span></div>
        <div class="panel-body">
          <div class="callout">本页由 <code>corepack pnpm release:acceptance</code> 生成。命令失败时仍会写出报告并返回非 0 退出码，作为发版阻塞凭证。</div>
          <table style="margin-top: 12px">
            <tbody>
              <tr><th>完整提交</th><td class="mono">${escapeHtml(model.metadata.fullCommit)}</td></tr>
              <tr><th>工作区状态</th><td><pre>${escapeHtml(model.metadata.dirtySummary)}</pre></td></tr>
              <tr><th>浏览器 E2E</th><td>默认不阻塞；使用 <code>--include-browser</code> 显式纳入本报告。</td></tr>
              <tr><th>报告策略</th><td>测试矩阵动态读取 <code>scripts/root-test-targets.mjs</code>，新增测试登记后自动出现在本页。</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

    <section class="panel">
      <div class="panel-head"><h2>测试矩阵</h2><span>root targets</span></div>
      <div class="panel-body">
        <table>
          <thead><tr><th>目标</th><th>文件数</th><th>命令</th><th>测试文件</th></tr></thead>
          <tbody>${renderTargetRows(model.rootTargets)}</tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>新增覆盖</h2><span>browser targets</span></div>
      <div class="panel-body">
        <table>
          <thead><tr><th>目标</th><th>文件数</th><th>命令</th><th>测试文件</th></tr></thead>
          <tbody>${renderTargetRows(model.browserTargets)}</tbody>
        </table>
      </div>
    </section>

    <section class="panel">
      <div class="panel-head"><h2>未覆盖边界</h2><span>${escapeHtml(model.coverageSummary.uncoveredBoundaries)} 项</span></div>
      <div class="panel-body">
        <table>
          <thead><tr><th>对象</th><th>边界描述</th></tr></thead>
          <tbody>${renderBoundaryRows(model.uncoveredBoundaries)}</tbody>
        </table>
      </div>
    </section>

    <footer>生成器：<code>scripts/release-acceptance-report.mjs</code>。默认输出：<code>${escapeHtml(defaultOutputFile)}</code>。</footer>
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
