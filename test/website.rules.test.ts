import {existsSync, readdirSync, readFileSync, statSync} from 'node:fs'
import {join} from 'node:path'
import {describe, expect, test} from '@rstest/core'
import {repoRoot} from './helpers/repo-root'

const readJson = <T = any>(path: string): T => JSON.parse(readFileSync(path, 'utf8')) as T
const readText = (path: string) => readFileSync(path, 'utf8')

const rootPackagePath = join(repoRoot, 'package.json')
const websitePackagePath = join(repoRoot, 'website/package.json')
const websiteEmpConfigPath = join(repoRoot, 'website/emp.config.ts')
const websiteRspressConfigPath = join(repoRoot, 'website/rspress.config.ts')
const websiteDocsPath = join(repoRoot, 'website/docs')
const websiteDocBuildPath = join(repoRoot, 'website/doc_build')
const websiteSrcPath = join(repoRoot, 'website/src')
const websiteIndexPath = join(websiteSrcPath, 'index.tsx')
const websiteAppPath = join(websiteSrcPath, 'App.tsx')
const websiteStylesPath = join(websiteSrcPath, 'styles.css')
const websitePublicPath = join(repoRoot, 'website/public')
const readmePath = join(repoRoot, 'README.md')

const githubSkillDir = 'https://github.com/empjs/emp/tree/v4/skills/emp'
const githubRepository = 'https://github.com/empjs/emp'
const rspackLogo = 'https://assets.rspack.rs/rspack/rspack-logo.svg'

const websiteAssets = [
  {
    name: 'emp-federation-fox-hero.webp',
    maxBytes: 460 * 1024,
  },
  {
    name: 'emp-federation-fox-logo.webp',
    maxBytes: 70 * 1024,
  },
  {
    name: 'emp-federation-fox-mark.png',
    maxBytes: 260 * 1024,
  },
  {
    name: 'emp-federation-fox-mark-native.webp',
    maxBytes: 220 * 1024,
  },
  {
    name: 'emp-circuit-background.svg',
    maxBytes: 32 * 1024,
  },
  {
    name: 'emp-tech-background-desktop.webp',
    maxBytes: 100 * 1024,
  },
  {
    name: 'emp-tech-background-mobile.webp',
    maxBytes: 80 * 1024,
  },
] as const

const collectFiles = (dir: string): string[] => {
  if (!existsSync(dir)) return []

  return readdirSync(dir, {withFileTypes: true}).flatMap(entry => {
    const path = join(dir, entry.name)

    return entry.isDirectory() ? collectFiles(path) : [path]
  })
}

describe('website agent-first special page rules', () => {
  test('uses EMP React Tailwind workspace package without Rspress dependencies', () => {
    const pkg = readJson<{
      name: string
      type: string
      private: boolean
      scripts: Record<string, string>
      dependencies?: Record<string, string>
      devDependencies?: Record<string, string>
    }>(websitePackagePath)
    const allDeps = {...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {})}

    expect(pkg.name).toBe('@empjs/website')
    expect(pkg.type).toBe('module')
    expect(pkg.private).toBe(true)
    expect(pkg.scripts).toEqual({
      dev: 'emp dev',
      build: 'emp build',
      start: 'emp serve',
    })
    expect(allDeps['@empjs/cli']).toBe('workspace:*')
    expect(allDeps['@empjs/plugin-react']).toBe('workspace:*')
    expect(allDeps['@empjs/plugin-tailwindcss']).toBe('workspace:^')
    expect(allDeps.react).toBe('^19.2.3')
    expect(allDeps['react-dom']).toBe('^19.2.3')
    expect(allDeps['@types/react']).toBe('^19')
    expect(allDeps['@types/react-dom']).toBe('^19')
    expect(allDeps.typescript).toBe('7.0.2')

    for (const removedPackage of ['@rspress/core', '@rspress/plugin-sitemap', 'rspress', 'rspress-plugin-sitemap']) {
      expect(allDeps[removedPackage]).toBeUndefined()
    }
  })

  test('root scripts expose website aliases and keep offical compatibility aliases', () => {
    const rootPkg = readJson<{scripts: Record<string, string>}>(rootPackagePath)

    expect(rootPkg.scripts['website:dev']).toBe('corepack pnpm --filter @empjs/website dev')
    expect(rootPkg.scripts['website:build']).toBe('corepack pnpm --filter @empjs/website build')
    expect(rootPkg.scripts['website:start']).toBe('corepack pnpm --filter @empjs/website start')
    expect(rootPkg.scripts['offical:dev']).toBe('corepack pnpm --filter @empjs/website dev')
    expect(rootPkg.scripts['offical:build']).toBe('corepack pnpm --filter @empjs/website build')
    expect(rootPkg.scripts['offical:start']).toBe('corepack pnpm --filter @empjs/website start')
  })

  test('removes Rspress and exposes a single EMP app source tree', () => {
    expect(existsSync(websiteRspressConfigPath)).toBe(false)
    expect(existsSync(websiteDocsPath)).toBe(false)
    expect(existsSync(websiteDocBuildPath)).toBe(false)
    expect(existsSync(websiteEmpConfigPath)).toBe(true)
    expect(existsSync(websiteIndexPath)).toBe(true)
    expect(existsSync(websiteAppPath)).toBe(true)
    expect(existsSync(websiteStylesPath)).toBe(true)

    const config = readText(websiteEmpConfigPath)

    expect(config).toContain("import {defineConfig} from '@empjs/cli'")
    expect(config).toContain("import pluginReact from '@empjs/plugin-react'")
    expect(config).toContain("import pluginTailwindcss from '@empjs/plugin-tailwindcss'")
    expect(config).toContain('pluginReact()')
    expect(config).toContain('pluginTailwindcss()')
    expect(config).toContain("title: 'EMP - AGENT-FIRST'")
    expect(config).toContain("path: path.resolve(__dirname, 'dist')")
  })

  test('homepage matches the skills-first EMP landing-page contract', () => {
    const app = readText(websiteAppPath)
    const styles = readText(websiteStylesPath)
    const sourceFiles = collectFiles(websiteSrcPath).map(readText).join('\n')

    for (const marker of [
      'AGENT-FIRST',
      'Agent Skill First',
      'Enterprise Micro-Frontend Solution',
      'Open GitHub',
      githubSkillDir,
      githubRepository,
      rspackLogo,
      "name: 'Rspack 2'",
      "name: 'Module Federation 2'",
      "name: 'TypeScript 7'",
      'React Compiler',
    ]) {
      expect(sourceFiles).toContain(marker)
    }

    expect(app).toContain('emp-federation-fox-mark.png')
    expect(app).toContain('emp-federation-fox-mark-native.webp')
    expect(app).toContain('<strong>$emp</strong>')
    expect(app).toContain('className="hero-layout"')
    expect(app).toContain('className="foundation-grid"')
    expect(app).not.toContain('<footer')
    expect(styles).toContain('@import "tailwindcss"')
    expect(styles).toContain('url("../public/emp-tech-background-desktop.webp")')
    expect(styles).toContain('url("../public/emp-tech-background-mobile.webp")')
    expect(styles).toContain('"Arial Black"')
    expect(styles).toContain('"PingFang SC"')
    expect(styles).toContain('grid-template-columns: repeat(4, minmax(0, 1fr));')
    expect(styles).toContain('@media (max-width: 820px)')
    expect(styles).toContain('grid-template-columns: repeat(2, minmax(0, 1fr));')
    expect(styles).toContain('@media (prefers-reduced-motion: reduce)')

    for (const removedMarker of ['Rspress', '博客', 'Blog', 'data-theme', 'localStorage']) {
      expect(sourceFiles).not.toContain(removedMarker)
    }
  })

  test('web image cuts are present and compressed for first viewport usage', () => {
    for (const asset of websiteAssets) {
      const assetPath = join(websitePublicPath, asset.name)

      expect(existsSync(assetPath), `${asset.name} should exist`).toBe(true)
      expect(statSync(assetPath).size, `${asset.name} should be web-sized`).toBeLessThan(asset.maxBytes)
    }
  })

  test('README uses the federation fox mascot as the primary project mark', () => {
    const readme = readText(readmePath)

    expect(readme).toContain('docs/assets/emp-federation-fox-full.png')
    expect(readme).toContain('EMP Federation Fox')
    expect(readme).toContain('npm latest manifest')
    expect(readme).not.toContain('@empjs/cli@rc')
    expect(readme).not.toContain('%40empjs%2Fcli%40rc')
    expect(readme).not.toContain('rc manifest')
  })
})
