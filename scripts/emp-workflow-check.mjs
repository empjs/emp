import fs from 'node:fs'
import path from 'node:path'

const root = process.cwd()
const failures = []

const read = file => fs.readFileSync(path.join(root, file), 'utf8')
const exists = file => fs.existsSync(path.join(root, file))

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
  '.github/workflows/ci.yml',
  '.github/workflows/publish.yml',
  '.github/pull_request_template.md',
  '.github/CODEOWNERS',
  'skills/emp-workflow/SKILL.md',
  'skills/emp-workflow/agents/openai.yaml',
  'skills/emp-workflow/references/change-matrix.md',
  'scripts/emp-workflow-check.mjs',
]) {
  requireFile(file)
}

for (const heading of [
  '## 项目级 Skill 约定',
  '## 目录边界',
  '## Git / PR / Review 闭环',
  '## 自动化运行规则',
  '## 统一真实测试策略',
]) {
  requireText('AGENTS.md', heading)
}

for (const protectedPath of ['projects/**', 'website', 'docs/superpowers/', 'packages/cdn-*', 'packages/lib-*']) {
  requireText('AGENTS.md', protectedPath)
}

requireNoPattern('.github/workflows/ci.yml', /NODE_AUTH_TOKEN|npm publish|release:publish/)

if (exists('package.json')) {
  const pkg = JSON.parse(read('package.json'))
  if (pkg.scripts?.['workflow:check'] !== 'node scripts/emp-workflow-check.mjs') {
    failures.push('package.json missing script: workflow:check')
  }
  if (!pkg.scripts?.['ci:verify']?.includes('pnpm workflow:check')) {
    failures.push('package.json ci:verify does not include pnpm workflow:check')
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
