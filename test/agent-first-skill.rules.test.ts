import {describe, expect, test} from '@rstest/core'
import {existsSync, readFileSync, readdirSync} from 'node:fs'
import {join} from 'node:path'
import {repoRoot} from './helpers/repo-root'

const readText = (path: string) => readFileSync(path, 'utf8')

const skillDir = join(repoRoot, 'skills/emp-v4-agent-first')
const skillPath = join(skillDir, 'SKILL.md')
const openaiYamlPath = join(skillDir, 'agents/openai.yaml')
const referencesDir = join(skillDir, 'references')
const referenceFiles = [
  'project-setup.md',
  'module-federation.md',
  'plugins.md',
  'validation-release.md',
] as const
const websiteAgentFirstPath = join(repoRoot, 'website/docs/zh/guide/agent-first.md')
const websiteGuideMetaPath = join(repoRoot, 'website/docs/zh/guide/_meta.json')
const websiteHomePath = join(repoRoot, 'website/docs/zh/index.mdx')
const websitePluginsPath = join(repoRoot, 'website/docs/zh/plugins/index.md')
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
    expect(frontmatter).toContain('name: emp-v4-agent-first')
    expect(frontmatter).toContain('Agent-First')
    expect(frontmatter).toContain('plugins')
    expect(frontmatter).toContain('Module Federation')
    expect(skill).toContain('# EMP v4 Agent-First')
    expect(skill).toContain('skills/emp-v4-agent-first')

    for (const referenceFile of referenceFiles) {
      expect(skill).toContain(`references/${referenceFile}`)
      expect(existsSync(join(referencesDir, referenceFile)), `${referenceFile} should exist`).toBe(true)
    }

    expect(skill).not.toMatch(/\bTODO\b|\[TODO/)
    expect(openaiYaml).toContain('display_name: "EMP v4 Agent-First"')
    expect(openaiYaml).toContain('default_prompt: "Use $emp-v4-agent-first')
  })

  test('skill folders do not ship nested compatibility skill directories', () => {
    const skillFolders = readdirSync(join(repoRoot, 'skills'), {withFileTypes: true})
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)

    expect(skillFolders).toEqual(['emp-v4-agent-first', 'emp-workflow'])

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
      'emp create',
      '--dry-run --json',
      'emp doctor --json',
    ]) {
      expect(setup).toContain(marker)
    }

    for (const marker of [
      '@empjs/share/rspack',
      'pluginRspackEmpShare',
      'exposes',
      'remotes',
      'shared',
      'empRuntime.version',
      'manifest',
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
    ]) {
      expect(plugins).toContain(marker)
    }
    expect(plugins).not.toMatch(/Tailwind CSS 3|Tailwind 3|tailwind-3/)

    for (const marker of [
      'corepack pnpm workflow:check',
      'corepack pnpm ci:verify',
      'corepack pnpm empbuild',
      'corepack pnpm apps:acceptance',
      'corepack pnpm release:acceptance',
      'corepack pnpm release:publish:dry -- --skip-build',
    ]) {
      expect(validation).toContain(marker)
    }
  })

  test('official docs guide users to the repository skill instead of duplicating the manual', () => {
    const guidePage = expectFile(websiteAgentFirstPath)
    const guideMeta = expectFile(websiteGuideMetaPath)
    const home = expectFile(websiteHomePath)
    const pluginsPage = expectFile(websitePluginsPath)

    expect(guideMeta).toContain('"agent-first"')
    expect(home).toContain('27 篇中文文档')
    expect(home).toContain('Agent-First 使用手册')
    expect(home).toContain('/guide/agent-first.html')
    expect(pluginsPage).toContain('skills/emp-v4-agent-first/references/plugins.md')

    for (const marker of [
      '$emp-v4-agent-first',
      'https://github.com/empjs/emp/tree/v4/skills/emp-v4-agent-first',
      'skills/emp-v4-agent-first/SKILL.md',
      'references/project-setup.md',
      'references/module-federation.md',
      'references/plugins.md',
      'references/validation-release.md',
    ]) {
      expect(guidePage).toContain(marker)
    }

    expect(guidePage).not.toContain('pluginRspackEmpShare({')
    expect(guidePage).not.toContain('plugins: [')
    expect(guidePage).not.toContain('github.com/empjs/emp/tree/main/skills')
    expect(guidePage).not.toContain('github.com/empjs/emp/blob/main/skills')
  })
})
