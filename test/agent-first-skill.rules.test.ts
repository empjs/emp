import {describe, expect, test} from '@rstest/core'
import {existsSync, readFileSync, readdirSync} from 'node:fs'
import {join} from 'node:path'
import {repoRoot} from './helpers/repo-root'

const readText = (path: string) => readFileSync(path, 'utf8')

const skillDir = join(repoRoot, 'skills/emp')
const skillPath = join(skillDir, 'SKILL.md')
const openaiYamlPath = join(skillDir, 'agents/openai.yaml')
const referencesDir = join(skillDir, 'references')
const referenceFiles = [
  'project-setup.md',
  'module-federation.md',
  'plugins.md',
  'validation-release.md',
] as const
const websiteAppPath = join(repoRoot, 'website/src/App.tsx')
const staleNestedSkillDirs = ['.agent/skills', '.agents/skills', '.shared/skills'] as const

const expectFile = (path: string) => {
  expect(existsSync(path), `${path} should exist`).toBe(true)
  return readText(path)
}

describe('EMP v4 Agent-First repository skill', () => {
  test('skill folder uses the project skill structure and progressive references', () => {
    const skill = expectFile(skillPath)
    const openaiYaml = expectFile(openaiYamlPath)
    const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/)?.[1] ?? ''
    const frontmatterKeys = [...frontmatter.matchAll(/^([a-z-]+):/gm)].map(match => match[1])

    expect(frontmatterKeys).toEqual(['name', 'description'])
    expect(frontmatter).toContain('name: emp')
    expect(frontmatter).toContain('Agent-First')
    expect(frontmatter).toContain('plugins')
    expect(frontmatter).toContain('Module Federation')
    expect(skill).toContain('# EMP')
    expect(skill).toContain('skills/emp')
    expect(skill).toContain('TypeScript 7 stable')
    expect(skill).toContain('Task Map')
    expect(skill).toContain('project creation')
    expect(skill).toContain('existing project migration')
    expect(skill).toContain('Module Federation')
    expect(skill).toContain('plugin selection')
    expect(skill).toContain('app acceptance')
    expect(skill).toContain('release evidence')
    expect(skill).toContain('GitHub releases')
    expect(skill).toContain('https://github.com/empjs/emp/releases')
    expect(skill).toContain('https://github.com/empjs/emp/tags')
    expect(skill).not.toContain('TypeScript 7 rc')

    for (const referenceFile of referenceFiles) {
      expect(skill).toContain(`references/${referenceFile}`)
      expect(existsSync(join(referencesDir, referenceFile)), `${referenceFile} should exist`).toBe(true)
    }

    expect(skill).not.toMatch(/\bTODO\b|\[TODO/)
    expect(openaiYaml).toContain('display_name: "EMP"')
    expect(openaiYaml).toContain('default_prompt: "Use $emp')
  })

  test('skill folders do not ship nested compatibility skill directories', () => {
    const skillFolders = readdirSync(join(repoRoot, 'skills'), {withFileTypes: true})
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)

    expect(skillFolders).toEqual(['emp', 'emp-workflow'])

    for (const skillFolder of skillFolders) {
      for (const staleDir of staleNestedSkillDirs) {
        const stalePath = join(repoRoot, 'skills', skillFolder, staleDir)

        expect(existsSync(stalePath), `${skillFolder}/${staleDir} should not exist`).toBe(false)
      }
    }
  })

  test('references cover setup, federation, plugins, validation, and release usage', () => {
    const setup = expectFile(join(referencesDir, 'project-setup.md'))
    const federation = expectFile(join(referencesDir, 'module-federation.md'))
    const plugins = expectFile(join(referencesDir, 'plugins.md'))
    const validation = expectFile(join(referencesDir, 'validation-release.md'))

    for (const marker of [
      'Node.js `^20.19.0 || >=22.12.0`',
      'pnpm@10.33.0',
      'formal release packages',
      'emp create',
      '--dry-run --json',
      'emp doctor --json',
      'Inputs to collect',
      'Files to inspect',
      'Success evidence',
    ]) {
      expect(setup).toContain(marker)
    }
    expect(setup).not.toContain('@rc')
    expect(setup).not.toContain('rc packages')

    for (const marker of [
      '@empjs/share/rspack',
      'pluginRspackEmpShare',
      'exposes',
      'remotes',
      'shared',
      'empRuntime.version',
      'manifest',
      'Inputs to collect',
      'Files to inspect',
      'Success evidence',
    ]) {
      expect(federation).toContain(marker)
    }

    for (const marker of [
      '@empjs/plugin-react',
      '@empjs/plugin-vue2',
      '@empjs/plugin-vue3',
      '@empjs/plugin-tailwindcss',
      '@empjs/plugin-postcss',
      '@empjs/plugin-lightningcss',
      '@empjs/plugin-stylus',
      '@empjs/biome-config',
      '@empjs/eslint-config-react',
      'Tailwind CSS 4',
      'Inputs to collect',
      'Files to inspect',
      'Success evidence',
    ]) {
      expect(plugins).toContain(marker)
    }
    expect(plugins).not.toMatch(/Tailwind CSS 3|Tailwind 3|tailwind-3/)

    for (const marker of [
      'React Compiler',
      '默认不自动开启',
      'Agent 可以建议开启',
      'react-compiler-runtime',
      "target: '18'",
      'compilationMode',
      'Module Federation',
    ]) {
      expect(plugins).toContain(marker)
    }

    for (const marker of [
      'corepack pnpm workflow:check',
      'corepack pnpm ci:verify',
      'corepack pnpm empbuild',
      'corepack pnpm apps:acceptance',
      'corepack pnpm release:acceptance',
      'corepack pnpm release:publish:dry -- --skip-build',
      '版本封面',
      'EMP Federation Fox',
      '左上角',
      'docs/assets/emp-v4-readme-logo.png',
      'GitHub Release asset',
      '中文 release notes',
      'GitHub Releases',
      'GitHub Tags',
      'Inputs to collect',
      'Files to inspect',
      'Success evidence',
    ]) {
      expect(validation).toContain(marker)
    }
    expect(validation).toContain('formal release')
    expect(validation).not.toContain('release candidate')
  })

  test('official website guides users to the repository skill instead of duplicating the manual', () => {
    const homepage = expectFile(websiteAppPath)

    for (const marker of [
      '$emp',
      'https://github.com/empjs/emp/tree/v4/skills/emp',
      'skills/emp/SKILL.md',
      'references/project-setup.md',
      'references/module-federation.md',
      'references/plugins.md',
      'references/validation-release.md',
    ]) {
      expect(homepage).toContain(marker)
    }

    expect(homepage).not.toContain('pluginRspackEmpShare({')
    expect(homepage).not.toContain('github.com/empjs/emp/tree/main/skills')
    expect(homepage).not.toContain('github.com/empjs/emp/blob/main/skills')
  })
})
