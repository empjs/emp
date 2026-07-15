import fs from 'node:fs'
import path from 'node:path'
import {
  ROOT_BROWSER_TEST_PACKAGE_SCRIPTS,
  ROOT_BROWSER_TEST_TARGETS,
  ROOT_RSTEST_CONFIG,
  ROOT_TEST_PACKAGE_SCRIPTS,
  ROOT_TEST_TARGETS,
  rootBrowserTestCommand,
  rootTestCommand,
} from './root-test-targets.mjs'

const root = process.cwd()
const failures = []

const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const exists = file => fs.existsSync(path.join(root, file))
const readJson = file => JSON.parse(read(file))
const normalizePath = file => file.split(path.sep).join('/')

const parseJson = file => {
  try {
    return readJson(file)
  } catch (error) {
    failures.push(`${file} is not valid JSON: ${error.message}`)
    return null
  }
}

const listFiles = dir => {
  const base = path.join(root, dir)
  if (!fs.existsSync(base)) return []

  const files = []
  for (const entry of fs.readdirSync(base, {withFileTypes: true})) {
    const relativePath = path.join(dir, entry.name)
    if (entry.isDirectory()) files.push(...listFiles(relativePath))
    else if (entry.isFile()) files.push(normalizePath(relativePath))
  }
  return files
}

const requireFile = file => {
  if (!exists(file)) failures.push(`missing required file: ${file}`)
}

const requireText = (file, text) => {
  if (!exists(file)) {
    failures.push(`cannot check missing file: ${file}`)
    return
  }
  if (!read(file).includes(text)) failures.push(`${file} missing text: ${text}`)
}

const requireNoPattern = (file, pattern) => {
  if (!exists(file)) {
    failures.push(`cannot scan missing file: ${file}`)
    return
  }
  if (pattern.test(read(file))) failures.push(`${file} contains forbidden pattern: ${pattern.source}`)
}

const retiredWorkflowPattern = new RegExp(['super', 'powers'].join(''), 'i')
const forbiddenCodexModelPattern = /gpt-5\.4-mini/

const parseFrontmatter = file => {
  const content = read(file)
  const match = content.match(/^---\n([\s\S]*?)\n---\n/)
  if (!match) {
    failures.push(`${file} missing YAML frontmatter`)
    return null
  }
  return match[1]
}

const checkSkill = skillDir => {
  const skillName = path.basename(skillDir)
  const skillFile = path.join(skillDir, 'SKILL.md')
  requireFile(skillFile)
  if (!exists(skillFile)) return

  const frontmatter = parseFrontmatter(skillFile)
  if (!frontmatter) return

  const keys = frontmatter
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)
    .map(line => line.split(':')[0])

  const extraKeys = keys.filter(key => key !== 'name' && key !== 'description')
  if (extraKeys.length > 0) failures.push(`${skillFile} has unsupported frontmatter keys: ${extraKeys.join(', ')}`)

  requireText(skillFile, `name: ${skillName}`)
  requireText(skillFile, 'description:')
  requireFile(path.join(skillDir, 'agents/openai.yaml'))

  for (const forbidden of ['README.md', 'INSTALLATION_GUIDE.md', 'QUICK_REFERENCE.md', 'CHANGELOG.md']) {
    if (exists(path.join(skillDir, forbidden))) failures.push(`${skillDir} contains forbidden skill doc: ${forbidden}`)
  }
}

for (const file of [
  'AGENTS.md',
  'package.json',
  '.codex/config.toml',
  '.codex/hooks.json',
  '.codex/agents/emp-spark.toml',
  '.codex/agents/emp-fast.toml',
  '.codex/agents/emp-impl.toml',
  '.codex/agents/emp-deep.toml',
  '.github/workflows/ci.yml',
  '.github/workflows/publish.yml',
  '.github/pull_request_template.md',
  '.github/CODEOWNERS',
  'skills/emp-workflow/SKILL.md',
  'skills/emp-workflow/agents/openai.yaml',
  'skills/emp-workflow/references/change-matrix.md',
  'scripts/emp-workflow-check.mjs',
  'scripts/root-test-targets.mjs',
  'scripts/run-root-test.mjs',
  'scripts/release-acceptance-report.mjs',
  ROOT_RSTEST_CONFIG,
]) {
  requireFile(file)
}

for (const heading of [
  '## 项目级 Skill 约定',
  '## 目录边界',
  '## Git / PR / Review 闭环',
  '## Worktree 清理规则',
  '## 自动化运行规则',
  '## 统一真实测试策略',
  '## Codex 触发层',
  '## 工作流决策矩阵',
  '## Token 优先编排规则',
]) {
  requireText('AGENTS.md', heading)
}

for (const text of [
  '.codex/config.toml',
  '.codex/hooks.json',
  '.codex/agents/emp-spark.toml',
  '.codex/agents/emp-fast.toml',
  '.codex/agents/emp-impl.toml',
  '.codex/agents/emp-deep.toml',
  'multi_agent',
]) {
  requireText('AGENTS.md', text)
}

requireText('AGENTS.md', '## CodeGraph 优先级')
for (const codegraphCommand of [
  'codegraph sync .',
  'codegraph status .',
  'codegraph query',
  'codegraph node',
  'codegraph callers',
  'codegraph affected',
  'codegraph explore',
]) {
  requireText('AGENTS.md', codegraphCommand)
  requireText('skills/emp-workflow/SKILL.md', codegraphCommand)
}
for (const file of ['AGENTS.md', 'skills/emp-workflow/SKILL.md']) {
  requireNoPattern(file, /codebase-memory-mcp/)
}

for (const text of [
  'model = "gpt-5.5"',
  'model_reasoning_effort = "low"',
  'model_reasoning_summary = "none"',
  'hooks = true',
  'goals = true',
  'multi_agent = true',
  'max_depth = 1',
  'max_threads = 4',
]) {
  requireText('.codex/config.toml', text)
}

for (const text of ['SessionStart', 'UserPromptSubmit', 'token-first', 'Spark', '5.4', '5.5', '5.6', 'workflow gate']) {
  requireText('.codex/hooks.json', text)
}

const hooksConfig = exists('.codex/hooks.json') ? parseJson('.codex/hooks.json') : null
if (hooksConfig) {
  for (const eventName of ['SessionStart', 'UserPromptSubmit']) {
    if (!Array.isArray(hooksConfig.hooks?.[eventName])) failures.push(`.codex/hooks.json missing hooks.${eventName} array`)
  }
  for (const [eventName, entries] of Object.entries(hooksConfig.hooks ?? {})) {
    if (!Array.isArray(entries)) continue
    for (const [entryIndex, entry] of entries.entries()) {
      if (typeof entry.matcher !== 'string') failures.push(`.codex/hooks.json ${eventName}[${entryIndex}] missing matcher`)
      if (!Array.isArray(entry.hooks) || entry.hooks.length === 0) failures.push(`.codex/hooks.json ${eventName}[${entryIndex}] missing hooks`)
      for (const [hookIndex, hook] of (entry.hooks ?? []).entries()) {
        if (hook.type !== 'command') failures.push(`.codex/hooks.json ${eventName}[${entryIndex}].hooks[${hookIndex}] must be command`)
        if (typeof hook.command !== 'string' || !hook.command.includes('EMP')) {
          failures.push(`.codex/hooks.json ${eventName}[${entryIndex}].hooks[${hookIndex}] command must contain EMP reminder`)
        }
      }
    }
  }
}

const agentExpectations = {
  '.codex/agents/emp-spark.toml': ['name = "emp-spark"', 'model = "gpt-5.3-codex-spark"', 'model_reasoning_effort = "low"', 'model_reasoning_summary = "none"', 'sandbox_mode = "read-only"'],
  '.codex/agents/emp-fast.toml': ['name = "emp-fast"', 'model = "gpt-5.4"', 'model_reasoning_effort = "low"', 'CodeGraph'],
  '.codex/agents/emp-impl.toml': ['name = "emp-impl"', 'model = "gpt-5.5"', 'model_reasoning_effort = "medium"', 'NEEDS_CONTEXT'],
  '.codex/agents/emp-deep.toml': ['name = "emp-deep"', 'model = "gpt-5.6-sol"', 'model_reasoning_effort = "high"', 'sandbox_mode = "read-only"', 'BLOCKED'],
}
for (const [file, texts] of Object.entries(agentExpectations)) {
  for (const text of texts) requireText(file, text)
  requireNoPattern(file, /^model\s*=\s*"gpt-5\.6"$/m)
}

for (const text of [
  '.codex/hooks.json',
  '.codex/agents/',
  'subagent',
  'Decision Rules',
  'spawn_agent',
  'Token-First Model Routing',
  'Delegation Contract',
]) {
  requireText('skills/emp-workflow/SKILL.md', text)
}

for (const text of ['只读审计', '.codex/agents/emp-*.toml']) {
  requireText('AGENTS.md', text)
}

for (const text of [
  'git worktree list --porcelain',
  'du -sh .worktrees',
  'git -C <path> status --short --branch',
  'git worktree remove <path>',
  'git worktree prune',
  'git merge-base --is-ancestor <branch> v4',
  'rm -rf .worktrees',
]) {
  requireText('AGENTS.md', text)
}

for (const text of ['git worktree list --porcelain', 'du -sh .worktrees', 'git worktree remove <path>', 'git worktree prune']) {
  requireText('skills/emp-workflow/SKILL.md', text)
  requireText('skills/emp-workflow/references/change-matrix.md', text)
}

for (const text of ['parse `.codex/hooks.json`', 'prompt assembly, not hook stdout execution', 'untracked `.codex/*`']) {
  requireText('skills/emp-workflow/references/change-matrix.md', text)
}

for (const file of ['.codex/config.toml', '.codex/hooks.json', '.codex/agents/emp-spark.toml', '.codex/agents/emp-fast.toml', '.codex/agents/emp-impl.toml', '.codex/agents/emp-deep.toml']) {
  requireNoPattern(file, /codebase-memory-mcp/)
}

for (const protectedPath of ['apps/**', 'website', '仓库内历史工作流目录', 'packages/cdn-*', 'packages/lib-*', '.worktrees/']) {
  requireText('AGENTS.md', protectedPath)
}

for (const file of [
  'AGENTS.md',
  '.codex/hooks.json',
  '.codex/agents/emp-spark.toml',
  '.codex/agents/emp-fast.toml',
  '.codex/agents/emp-impl.toml',
  '.codex/agents/emp-deep.toml',
  '.github/pull_request_template.md',
  'skills/emp-workflow/SKILL.md',
  'skills/emp-workflow/references/change-matrix.md',
]) {
  requireNoPattern(file, retiredWorkflowPattern)
  requireNoPattern(file, forbiddenCodexModelPattern)
}

if (exists(['.super', 'powers'].join(''))) {
  failures.push('retired workflow directory must not exist')
}
if (exists('.agents')) failures.push('.agents must not be used for repo-local skill injection')

requireNoPattern('.github/workflows/ci.yml', /NODE_AUTH_TOKEN|npm publish|release:publish/)

if (exists('package.json')) {
  const pkg = readJson('package.json')
  if (pkg.scripts?.['workflow:check'] !== 'node scripts/emp-workflow-check.mjs') {
    failures.push('package.json missing script: workflow:check')
  }
  if (!pkg.scripts?.['ci:verify']?.includes('pnpm workflow:check')) {
    failures.push('package.json ci:verify does not include pnpm workflow:check')
  }
  if (pkg.scripts?.['release:acceptance'] !== 'node scripts/release-acceptance-report.mjs') {
    failures.push('package.json release:acceptance must run node scripts/release-acceptance-report.mjs')
  }
  const testPackages = pkg.scripts?.['test:packages'] ?? ''
  if (!testPackages.includes('pnpm test:plugins')) {
    failures.push('package.json test:packages must include pnpm test:plugins for plugin config coverage')
  }
  const testPlugins = pkg.scripts?.['test:plugins'] ?? ''
  if (!testPlugins.includes('pnpm --filter @empjs/chain build')) {
    failures.push('package.json test:plugins must build @empjs/chain before importing dist config helpers')
  }
  if (!testPlugins.includes('pnpm empbuild:plugin')) {
    failures.push('package.json test:plugins must build plugin dist packages before importing them')
  }
  if (!testPlugins.includes('node scripts/run-root-test.mjs plugins')) {
    failures.push('package.json test:plugins must run the plugins root test target')
  }
  const appsAcceptance = pkg.scripts?.['apps:acceptance'] ?? ''
  if (!appsAcceptance.includes('pnpm empbuild')) {
    failures.push('package.json apps:acceptance must run full pnpm empbuild before app builds')
  }
  if (
    appsAcceptance.includes('--filter ./apps/rspack2-modern-module') &&
    appsAcceptance.indexOf('pnpm empbuild') > appsAcceptance.indexOf('--filter ./apps/rspack2-modern-module')
  ) {
    failures.push('package.json apps:acceptance runs pnpm empbuild after app builds')
  }
  if (!appsAcceptance.includes('pnpm apps:check')) {
    failures.push('package.json apps:acceptance must run pnpm apps:check before app builds')
  }
  if (!appsAcceptance.includes('pnpm test:apps:single')) {
    failures.push('package.json apps:acceptance must run pnpm test:apps:single for canonical app builds')
  }
  if (appsAcceptance.includes('pnpm test:apps:mf')) {
    failures.push('package.json apps:acceptance must not run removed pnpm test:apps:mf browser smoke')
  }
  if (!appsAcceptance.includes('pnpm test:library-output')) {
    failures.push('package.json apps:acceptance must run pnpm test:library-output for package-level library output smoke')
  }
  if (appsAcceptance.includes('pnpm test:apps:browser')) {
    failures.push('package.json apps:acceptance must not run apps browser E2E; keep it in a separate lane')
  }
  for (const [scriptName, targetName] of Object.entries(ROOT_TEST_PACKAGE_SCRIPTS)) {
    const expectedCommand = rootTestCommand(targetName)
    if (pkg.scripts?.[scriptName] !== expectedCommand) {
      failures.push(`package.json ${scriptName} must run ${expectedCommand}`)
    }
  }
  for (const [scriptName, targetName] of Object.entries(ROOT_BROWSER_TEST_PACKAGE_SCRIPTS)) {
    const expectedCommand = rootBrowserTestCommand(targetName)
    if (pkg.scripts?.[scriptName] !== expectedCommand) {
      failures.push(`package.json ${scriptName} must run ${expectedCommand}`)
    }
  }
  const rootTargetFiles = ROOT_TEST_TARGETS.all
  const duplicateRootTargetFiles = rootTargetFiles.filter((file, index) => rootTargetFiles.indexOf(file) !== index)
  if (duplicateRootTargetFiles.length > 0) {
    failures.push(`ROOT_TEST_TARGETS contains duplicate root test files: ${duplicateRootTargetFiles.join(', ')}`)
  }
  for (const file of ROOT_TEST_TARGETS.all) {
    requireFile(file)
  }
  const expectedRootTestFiles = new Set(rootTargetFiles)
  const actualRootTestFiles = [...listFiles('test'), ...listFiles('apps/test')]
    .filter(file => file.endsWith('.test.ts') && !file.endsWith('.browser.test.ts') && !file.endsWith('.browser.ts'))
    .sort()
  for (const file of actualRootTestFiles) {
    if (!expectedRootTestFiles.has(file)) {
      failures.push(`root test file must be listed in ROOT_TEST_TARGETS: ${file}`)
    }
  }
  for (const file of expectedRootTestFiles) {
    if (!actualRootTestFiles.includes(file)) {
      failures.push(`ROOT_TEST_TARGETS references missing root test file: ${file}`)
    }
  }
  const browserTargetFiles = Object.values(ROOT_BROWSER_TEST_TARGETS).flat()
  const expectedBrowserTestFiles = new Set(browserTargetFiles)
  const actualBrowserTestFiles = [...listFiles('apps'), ...listFiles('packages/emp-share/test/browser')]
    .filter(file => file.endsWith('.browser.ts'))
    .sort()
  for (const file of browserTargetFiles) requireFile(file)
  for (const file of actualBrowserTestFiles) {
    const isAppsBrowserTest = /^apps\/[^/]+\/test\/browser\/.+\.browser\.ts$/.test(file)
    const isEmpShareBrowserTest = file.startsWith('packages/emp-share/test/browser/')
    if (!isAppsBrowserTest && !isEmpShareBrowserTest) {
      failures.push(`browser test file must live under apps/<app>/test/browser/ or packages/emp-share/test/browser/: ${file}`)
    }
    if (!expectedBrowserTestFiles.has(file)) {
      failures.push(`browser test file must be listed in ROOT_BROWSER_TEST_TARGETS: ${file}`)
    }
  }
  for (const file of expectedBrowserTestFiles) {
    if (!actualBrowserTestFiles.includes(file)) {
      failures.push(`ROOT_BROWSER_TEST_TARGETS references missing browser test file: ${file}`)
    }
  }
  const testCli = pkg.scripts?.['test:cli'] ?? ''
  if (!testCli.includes('pnpm --filter @empjs/chain build')) {
    failures.push('package.json test:cli must build @empjs/chain before @empjs/cli tests for clean CI')
  }
  if (
    testCli.includes('pnpm --filter @empjs/cli test') &&
    testCli.indexOf('pnpm --filter @empjs/chain build') > testCli.indexOf('pnpm --filter @empjs/cli test')
  ) {
    failures.push('package.json test:cli builds @empjs/chain after @empjs/cli tests')
  }
  if (pkg.devDependencies?.serve || pkg.dependencies?.serve) {
    failures.push('root package.json must not depend on third-party serve; use scripts/static-services.mjs and emp static')
  }
}

requireText('.github/workflows/ci.yml', 'pnpm apps:acceptance')
for (const text of [
  'ROOT_TEST_TARGETS',
  'ROOT_BROWSER_TEST_TARGETS',
  '.release/acceptance/index.html',
  '--include-browser',
]) {
  requireText('scripts/release-acceptance-report.mjs', text)
}

if (exists('packages/emp-share/package.json')) {
  const sharePkg = readJson('packages/emp-share/package.json')
  const shareTest = sharePkg.scripts?.test ?? ''
  if (!shareTest.includes('pnpm run build')) {
    failures.push('packages/emp-share package test must build dist before importing dist/rspack.js')
  }
  if (
    shareTest.includes('node test/') &&
    shareTest.indexOf('pnpm run build') > shareTest.indexOf('node test/')
  ) {
    failures.push('packages/emp-share package test builds dist after tests')
  }
}

for (const packageFile of ['packages/emp-chain/package.json', 'packages/plugin-react/package.json']) {
  if (!exists(packageFile)) continue
  const packageManifest = readJson(packageFile)
  const packageTest = packageManifest.scripts?.test ?? ''
  if (!packageTest.includes('pnpm run build')) {
    failures.push(`${packageFile} test must build dist before importing package dist files`)
  }
  if (
    packageTest.includes('node test/') &&
    packageTest.indexOf('pnpm run build') > packageTest.indexOf('node test/')
  ) {
    failures.push(`${packageFile} test builds dist after tests`)
  }
}

const staticScriptPackages = [
  'packages/cdn-react-17/package.json',
  'packages/cdn-react-18/package.json',
  'packages/cdn-react-19/package.json',
  'packages/cdn-react-wouter/package.json',
  'packages/cdn-react-19-tanstack-router/package.json',
  'packages/cdn-vue-2/package.json',
  'packages/cdn-vue-3/package.json',
  'packages/cdn-vue-router-pinia/package.json',
  'packages/lib-react-17/package.json',
  'packages/lib-vue-2/package.json',
  'packages/emp-share/package.json',
  'packages/emp-polyfill/package.json',
]

for (const packageFile of staticScriptPackages) {
  if (!exists(packageFile)) continue
  const pkg = readJson(packageFile)
  for (const [scriptName, command] of Object.entries(pkg.scripts ?? {})) {
    if (String(command).startsWith('serve ./')) {
      failures.push(`${packageFile} script ${scriptName} must use scripts/static-services.mjs instead of serve ./`)
    }
  }
}

if (exists(path.join('docs', ['super', 'powers'].join('')))) {
  failures.push('retired docs workflow directory must not be used')
}

if (exists('skills')) {
  for (const entry of fs.readdirSync(path.join(root, 'skills'), {withFileTypes: true})) {
    if (entry.isDirectory()) checkSkill(path.join('skills', entry.name))
  }
}

if (failures.length > 0) {
  console.error('EMP workflow check failed:')
  for (const failure of failures) console.error(`- ${failure}`)
  process.exit(1)
}

console.log('EMP workflow check passed.')
