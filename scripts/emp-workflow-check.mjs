import fs from 'node:fs'
import path from 'node:path'
import {ROOT_RSTEST_CONFIG, ROOT_TEST_PACKAGE_SCRIPTS, ROOT_TEST_TARGETS, rootTestCommand} from './root-test-targets.mjs'

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
  '.codex/agents/emp-fast.toml',
  '.codex/agents/emp-impl.toml',
  '.codex/agents/emp-deep.toml',
  '.github/workflows/ci.yml',
  '.github/workflows/publish.yml',
  '.github/pull_request_template.md',
  '.github/CODEOWNERS',
  '.superpowers/subagents.md',
  'skills/emp-workflow/SKILL.md',
  'skills/emp-workflow/agents/openai.yaml',
  'skills/emp-workflow/references/change-matrix.md',
  'scripts/emp-workflow-check.mjs',
  'scripts/root-test-targets.mjs',
  'scripts/run-root-test.mjs',
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
]) {
  requireText('AGENTS.md', heading)
}

for (const text of [
  '.superpowers/subagents.md',
  '.codex/config.toml',
  '.codex/hooks.json',
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

for (const text of ['hooks = true', 'goals = true', 'multi_agent = true', 'max_threads = 6']) {
  requireText('.codex/config.toml', text)
}

for (const text of ['SessionStart', 'UserPromptSubmit', '.superpowers/subagents.md', '.codex/agents/emp-*.toml', 'CodeGraph', 'commit', 'push', 'worktree', '.worktrees', 'workflow gate']) {
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
  '.codex/agents/emp-fast.toml': ['name = "emp-fast"', 'gpt-5.3-codex-spark', 'CodeGraph'],
  '.codex/agents/emp-impl.toml': ['name = "emp-impl"', 'gpt-5.4-mini', 'NEEDS_CONTEXT'],
  '.codex/agents/emp-deep.toml': ['name = "emp-deep"', 'gpt-5.4', 'BLOCKED'],
}
for (const [file, texts] of Object.entries(agentExpectations)) {
  for (const text of texts) requireText(file, text)
}

for (const text of [
  '.codex/hooks.json',
  '.codex/agents/',
  '.superpowers/subagents.md',
  'subagent',
  'Decision Rules',
  'spawn_agent',
]) {
  requireText('skills/emp-workflow/SKILL.md', text)
}

for (const text of [
  '## Codex 触发入口',
  '## 实际派发方式',
  '## 派发决策',
  'Brief Template',
  'Review Package Template',
  'agent_type',
  'Profile:',
  'emp-fast',
  'emp-impl',
  'emp-deep',
  'NEEDS_CONTEXT',
  'BLOCKED',
  'spawn_agent',
]) {
  requireText('.superpowers/subagents.md', text)
}

for (const text of ['只读审计', '实际派发方式', '.superpowers/subagents.md']) {
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

for (const file of ['.codex/config.toml', '.codex/hooks.json', '.codex/agents/emp-fast.toml', '.codex/agents/emp-impl.toml', '.codex/agents/emp-deep.toml', '.superpowers/subagents.md']) {
  requireNoPattern(file, /codebase-memory-mcp/)
}

for (const protectedPath of ['apps/**', 'website', 'docs/superpowers/', 'packages/cdn-*', 'packages/lib-*', '.worktrees/']) {
  requireText('AGENTS.md', protectedPath)
}

requireNoPattern('.github/workflows/ci.yml', /NODE_AUTH_TOKEN|npm publish|release:publish/)

if (exists('package.json')) {
  const pkg = readJson('package.json')
  if (pkg.scripts?.['workflow:check'] !== 'node scripts/emp-workflow-check.mjs') {
    failures.push('package.json missing script: workflow:check')
  }
  if (!pkg.scripts?.['ci:verify']?.includes('pnpm workflow:check')) {
    failures.push('package.json ci:verify does not include pnpm workflow:check')
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
  for (const [scriptName, targetName] of Object.entries(ROOT_TEST_PACKAGE_SCRIPTS)) {
    const expectedCommand = rootTestCommand(targetName)
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
  const actualRootTestFiles = listFiles('test')
    .filter(file => file.endsWith('.test.ts'))
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

if (exists('docs/superpowers')) failures.push('docs/superpowers must not be used')

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
