import {describe, expect, test} from '@rstest/core'
import {existsSync, readdirSync, readFileSync, realpathSync} from 'node:fs'
import {createRequire} from 'node:module'
import {join} from 'node:path'
import {pathToFileURL} from 'node:url'
import {repoRoot} from './helpers/repo-root'

const readJson = <T = any>(path: string): T => JSON.parse(readFileSync(path, 'utf8')) as T
const rootPackagePath = join(repoRoot, 'package.json')
const websitePackagePath = join(repoRoot, 'website/package.json')
const websiteConfigPath = join(repoRoot, 'website/rspress.config.ts')
const websiteDocsPath = join(repoRoot, 'website/docs')
const websiteZhPath = join(websiteDocsPath, 'zh')
const websiteHomePath = join(websiteZhPath, 'index.mdx')
const websiteLogoPath = join(websiteDocsPath, 'public/emp-v4-logo.png')
const docsLogoPath = join(repoRoot, 'docs/assets/emp-v4-logo.png')

const readPngHeader = (path: string) => {
  const png = readFileSync(path)
  expect(png.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a')
  expect(png.toString('ascii', 12, 16)).toBe('IHDR')

  return {
    bitDepth: png[24],
    colorType: png[25],
    width: png.readUInt32BE(16),
    height: png.readUInt32BE(20),
  }
}

describe('website rebuild rules', () => {
  test('uses the Rspress v2 workspace package without old theme dependencies', () => {
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
      dev: 'rspress dev',
      build: 'rspress build',
      start: 'rspress preview',
    })
    expect(allDeps['@rspress/core']).toBe('^2.0.16')
    expect(allDeps['@rspress/plugin-sitemap']).toBe('^2.0.16')
    expect(allDeps.typescript).toBe('7.0.1-rc')

    for (const legacyPackage of [
      'rspress',
      'rspress-plugin-sitemap',
      'tailwindcss',
      'antd',
      'framer-motion',
      'rsfamily-nav-icon',
      'react-intersection-observer',
    ]) {
      expect(allDeps[legacyPackage]).toBeUndefined()
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

  test('Rspress config uses v2 declarative navigation and AI-readable output', () => {
    const config = readFileSync(websiteConfigPath, 'utf8')

    expect(config).toContain("import {defineConfig} from '@rspress/core'")
    expect(config).toContain("import {pluginSitemap} from '@rspress/plugin-sitemap'")
    expect(config).toContain('llms: true')
    expect(config).toContain("lang: 'zh'")
    expect(config).toContain("root: path.join(__dirname, 'docs')")
    expect(config).toContain("icon: '/emp-v4-logo.png'")
    expect(config).toContain("light: '/emp-v4-logo.png'")
    expect(config).not.toContain("from 'rspress/config'")
    expect(config).not.toContain("name: 'emp-homepage-design'")
    expect(config).not.toContain('globalStyles')
    expect(config).not.toMatch(/\bnav\s*:/)
    expect(config).not.toMatch(/\bsidebar\s*:/)
  })

  test('homepage uses the native Rspress home frontmatter contract', async () => {
    const home = readFileSync(websiteHomePath, 'utf8')
    const featureCount = home.match(/\n  - title:/g)?.length ?? 0
    const requireFromRspressCore = createRequire(
      realpathSync(join(repoRoot, 'website/node_modules/@rspress/core/package.json')),
    )
    const {loadFrontMatter} = (await import(
      pathToFileURL(requireFromRspressCore.resolve('@rspress/shared/node-utils')).href
    )) as {
      loadFrontMatter: (
        source: string,
        filepath: string,
        root: string,
        outputWarning?: boolean,
      ) => {frontmatter: Record<string, any>; content: string}
    }
    const parsed = loadFrontMatter(home, websiteHomePath, websiteDocsPath, true)

    for (const requiredMarker of [
      'pageType:',
      'hero:',
      'features:',
      'image:',
      'actions:',
      'Rspack 2',
      'Module Federation 2',
      '7 个插件包',
      '26 篇中文文档',
    ]) {
      expect(home).toContain(requiredMarker)
    }

    expect(parsed.frontmatter.pageType).toBe('home')
    expect(parsed.frontmatter.hero?.name).toBe('EMP v4')
    expect(parsed.frontmatter.features).toHaveLength(6)
    expect(featureCount).toBeGreaterThanOrEqual(6)
    expect(existsSync(join(websiteZhPath, 'index.md'))).toBe(false)
    expect(home).not.toContain('class="emp-home"')
    expect(home).not.toContain('data-section=')
    expect(home).not.toContain('<section')
    expect(home).not.toContain('<article')
    expect(existsSync(join(websiteDocsPath, 'styles/home.css'))).toBe(false)
  })

  test('EMP v4 logo assets keep transparent PNG backgrounds', () => {
    for (const logoPath of [websiteLogoPath, docsLogoPath]) {
      const header = readPngHeader(logoPath)

      expect(header).toMatchObject({
        width: 512,
        height: 512,
        bitDepth: 8,
        colorType: 6,
      })
    }
  })

  test('documentation tree is Chinese-only and declarative', () => {
    const locales = readdirSync(websiteDocsPath, {withFileTypes: true})
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => name !== 'public')

    expect(locales).toEqual(['zh'])
    expect(existsSync(join(websiteZhPath, '_nav.json'))).toBe(true)
    expect(existsSync(join(websiteDocsPath, 'en'))).toBe(false)
    expect(existsSync(join(repoRoot, 'website/docs/public/emp-v4-logo.png'))).toBe(true)
  })

  test('old Rspress 1 theme and Tailwind 3 files are removed from the rebuilt site', () => {
    for (const removedPath of [
      'website/theme',
      'website/config',
      'website/tailwind.config.js',
      'website/postcss.config.js',
      'website/README.md',
    ]) {
      expect(existsSync(join(repoRoot, removedPath))).toBe(false)
    }
  })
})
