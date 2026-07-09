import {describe, expect, test} from '@rstest/core'
import {existsSync, readdirSync, readFileSync, realpathSync} from 'node:fs'
import {createRequire} from 'node:module'
import {join} from 'node:path'
import {pathToFileURL} from 'node:url'
import {inflateSync} from 'node:zlib'
import {repoRoot} from './helpers/repo-root'

const readJson = <T = any>(path: string): T => JSON.parse(readFileSync(path, 'utf8')) as T
const rootPackagePath = join(repoRoot, 'package.json')
const websitePackagePath = join(repoRoot, 'website/package.json')
const websiteConfigPath = join(repoRoot, 'website/rspress.config.ts')
const websiteDocsPath = join(repoRoot, 'website/docs')
const websiteEnPath = join(websiteDocsPath, 'en')
const websiteEnHomePath = join(websiteEnPath, 'index.mdx')
const websiteZhPath = join(websiteDocsPath, 'zh')
const websiteZhHomePath = join(websiteZhPath, 'index.mdx')
const websiteAppsMatrixPath = join(websiteZhPath, 'examples/apps-matrix.md')
const readmePath = join(repoRoot, 'README.md')
const websiteThemePath = join(websiteDocsPath, 'theme.css')
const federationFoxAssetNames = [
  'emp-federation-fox-full.png',
  'emp-federation-fox-compact.png',
  'emp-federation-fox-monochrome.png',
  'emp-federation-fox-outline.png',
]
const websiteFederationFoxAssetPaths = federationFoxAssetNames.map(assetName =>
  join(websiteDocsPath, 'public', assetName),
)
const docsFederationFoxAssetPaths = federationFoxAssetNames.map(assetName => join(repoRoot, 'docs/assets', assetName))

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

const paethPredictor = (left: number, up: number, upLeft: number) => {
  const estimate = left + up - upLeft
  const leftDistance = Math.abs(estimate - left)
  const upDistance = Math.abs(estimate - up)
  const upLeftDistance = Math.abs(estimate - upLeft)

  if (leftDistance <= upDistance && leftDistance <= upLeftDistance) {
    return left
  }

  if (upDistance <= upLeftDistance) {
    return up
  }

  return upLeft
}

const readPngRgba = (path: string) => {
  const png = readFileSync(path)
  const header = readPngHeader(path)
  const chunks: Buffer[] = []
  let offset = 8

  while (offset < png.length) {
    const length = png.readUInt32BE(offset)
    const type = png.toString('ascii', offset + 4, offset + 8)
    const dataStart = offset + 8
    const dataEnd = dataStart + length

    if (type === 'IDAT') {
      chunks.push(png.subarray(dataStart, dataEnd))
    }

    if (type === 'IEND') {
      break
    }

    offset = dataEnd + 4
  }

  expect(header.bitDepth).toBe(8)
  expect(header.colorType).toBe(6)

  const bytesPerPixel = 4
  const stride = header.width * bytesPerPixel
  const inflated = inflateSync(Buffer.concat(chunks))
  const rgba = Buffer.alloc(header.height * stride)
  let inputOffset = 0

  for (let y = 0; y < header.height; y++) {
    const filter = inflated[inputOffset++]
    const row = inflated.subarray(inputOffset, inputOffset + stride)
    const outputStart = y * stride

    inputOffset += stride

    for (let x = 0; x < stride; x++) {
      const raw = row[x]
      const left = x >= bytesPerPixel ? rgba[outputStart + x - bytesPerPixel] : 0
      const up = y > 0 ? rgba[outputStart - stride + x] : 0
      const upLeft = y > 0 && x >= bytesPerPixel ? rgba[outputStart - stride + x - bytesPerPixel] : 0

      if (filter === 0) {
        rgba[outputStart + x] = raw
      } else if (filter === 1) {
        rgba[outputStart + x] = (raw + left) & 0xff
      } else if (filter === 2) {
        rgba[outputStart + x] = (raw + up) & 0xff
      } else if (filter === 3) {
        rgba[outputStart + x] = (raw + Math.floor((left + up) / 2)) & 0xff
      } else if (filter === 4) {
        rgba[outputStart + x] = (raw + paethPredictor(left, up, upLeft)) & 0xff
      } else {
        throw new Error(`Unsupported PNG filter ${filter} in ${path}`)
      }
    }
  }

  return {
    ...header,
    countPixels: (predicate: (pixel: {r: number; g: number; b: number; a: number}) => boolean) => {
      let count = 0

      for (let pixelOffset = 0; pixelOffset < rgba.length; pixelOffset += bytesPerPixel) {
        if (
          predicate({
            r: rgba[pixelOffset],
            g: rgba[pixelOffset + 1],
            b: rgba[pixelOffset + 2],
            a: rgba[pixelOffset + 3],
          })
        ) {
          count++
        }
      }

      return count
    },
    getPixel: (x: number, y: number) => {
      const pixelOffset = (y * header.width + x) * bytesPerPixel

      return {
        r: rgba[pixelOffset],
        g: rgba[pixelOffset + 1],
        b: rgba[pixelOffset + 2],
        a: rgba[pixelOffset + 3],
      }
    },
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
    expect(allDeps['@rspress/core']).toBe('^2.0.17')
    expect(allDeps['@rspress/plugin-sitemap']).toBe('^2.0.17')
    expect(allDeps.typescript).toBe('7.0.2')

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
    expect(config).toContain("label: 'English'")
    expect(config).toContain("label: '简体中文'")
    expect(config).toContain("root: path.join(__dirname, 'docs')")
    expect(config).toContain("globalStyles: path.join(__dirname, 'docs/theme.css')")
    expect(config).toContain("icon: '/emp-federation-fox-compact.png'")
    expect(config).toContain("logoText: 'EMP'")
    expect(config).toContain("light: '/emp-federation-fox-compact.png'")
    expect(config).toContain("dark: '/emp-federation-fox-compact.png'")
    expect(config).toContain("text: 'Docs'")
    expect(config).toContain("text: 'Changelog'")
    expect(config).toContain("text: 'Blog'")
    expect(config).toContain("text: '文档'")
    expect(config).toContain("text: '更新日志'")
    expect(config).toContain("link: '/en/guide/index.html'")
    expect(config).toContain("link: '/guide/index.html'")
    expect(config).not.toContain("from 'rspress/config'")
    expect(config).not.toContain("name: 'emp-homepage-design'")
    expect(config).not.toMatch(/\bsidebar\s*:/)
  })

  test('localized homepages use the native Rspress home frontmatter contract', async () => {
    const enHome = readFileSync(websiteEnHomePath, 'utf8')
    const zhHome = readFileSync(websiteZhHomePath, 'utf8')
    const enFeatureCount = enHome.match(/\n  - title:/g)?.length ?? 0
    const zhFeatureCount = zhHome.match(/\n  - title:/g)?.length ?? 0
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
    const parsedEn = loadFrontMatter(enHome, websiteEnHomePath, websiteDocsPath, true)
    const parsedZh = loadFrontMatter(zhHome, websiteZhHomePath, websiteDocsPath, true)

    for (const requiredMarker of [
      'pageType:',
      'hero:',
      'features:',
      'image:',
      'actions:',
      '/emp-federation-fox-full.png',
      'Rspack 2',
      'Federated Frontend Build',
      'Blazing Fast',
      'Fully Typed',
      'Module Federation 2',
    ]) {
      expect(enHome).toContain(requiredMarker)
    }

    expect(parsedEn.frontmatter.pageType).toBe('home')
    expect(parsedEn.frontmatter.hero?.name).toBe('EMP')
    expect(parsedEn.frontmatter.titleSuffix).toBe('Federated Frontend Build')
    expect(parsedEn.frontmatter.hero?.text).toBe('Federated Frontend Build')
    expect(parsedEn.frontmatter.hero?.badge).toBeUndefined()
    expect(enHome).not.toContain('badge:')
    expect(enHome).not.toContain('High performance · Zero compromise')
    expect(parsedEn.frontmatter.description).toContain('Rspack 2')
    expect(parsedEn.frontmatter.description).toContain('TypeScript 7 stable')
    expect(parsedEn.frontmatter.description).toContain('Federated Frontend Build')
    expect(enHome).not.toContain('TypeScript 7 RC')
    expect(parsedEn.frontmatter.hero?.tagline).toContain('Build, compose and ship')
    expect(parsedEn.frontmatter.hero?.tagline).toContain('Blazing Fast')
    expect(parsedEn.frontmatter.hero?.actions?.[0]?.link).toBe('/en/guide/quick-start.html')
    expect(parsedEn.frontmatter.hero?.actions?.[1]?.link).toBe('/en/guide/index.html')
    expect(parsedEn.frontmatter.hero?.image?.src).toBe('/emp-federation-fox-full.png')
    expect(parsedEn.frontmatter.features).toHaveLength(4)
    expect(parsedEn.frontmatter.features.map((feature: {title: string}) => feature.title)).toEqual([
      'Module Federation 2',
      'Extreme Performance',
      'TypeScript 7',
      'Extensible Plugins',
    ])
    expect(enFeatureCount).toBe(4)
    expect(parsedZh.frontmatter.pageType).toBe('home')
    expect(parsedZh.frontmatter.hero?.name).toBe('EMP')
    expect(parsedZh.frontmatter.titleSuffix).toBe('联邦前端构建')
    expect(parsedZh.frontmatter.hero?.text).toBe('联邦前端构建')
    expect(parsedZh.frontmatter.hero?.badge).toBeUndefined()
    expect(zhHome).not.toContain('badge:')
    expect(zhHome).not.toContain('高性能 · 零妥协')
    expect(parsedZh.frontmatter.description).toContain('微前端')
    expect(parsedZh.frontmatter.hero?.tagline).toContain('轻松构建')
    expect(parsedZh.frontmatter.hero?.actions?.[0]?.text).toBe('快速开始')
    expect(parsedZh.frontmatter.hero?.actions?.[0]?.link).toBe('/guide/quick-start.html')
    expect(parsedZh.frontmatter.hero?.actions?.[1]?.text).toBe('查看文档')
    expect(parsedZh.frontmatter.hero?.actions?.[1]?.link).toBe('/guide/index.html')
    expect(parsedZh.frontmatter.hero?.image?.src).toBe('/emp-federation-fox-full.png')
    expect(parsedZh.frontmatter.features).toHaveLength(4)
    expect(parsedZh.frontmatter.features.map((feature: {title: string}) => feature.title)).toEqual([
      'Module Federation 2',
      '极致性能',
      'TypeScript 7',
      '可扩展插件',
    ])
    expect(zhFeatureCount).toBe(4)
    expect(existsSync(join(websiteEnPath, 'index.md'))).toBe(false)
    expect(existsSync(join(websiteZhPath, 'index.md'))).toBe(false)
    for (const home of [enHome, zhHome]) {
      expect(home).not.toContain('class="emp-home"')
      expect(home).not.toContain('data-section=')
      expect(home).not.toContain('<section')
      expect(home).not.toContain('<article')
    }
    expect(existsSync(websiteThemePath)).toBe(true)
  })

  test('README uses the federation fox mascot as the primary project mark', () => {
    const readme = readFileSync(readmePath, 'utf8')

    expect(readme).toContain('docs/assets/emp-federation-fox-full.png')
    expect(readme).toContain('EMP Federation Fox')
    expect(readme).toContain('npm latest manifest')
    expect(readme).not.toContain('@empjs/cli@rc')
    expect(readme).not.toContain('%40empjs%2Fcli%40rc')
    expect(readme).not.toContain('rc manifest')
    expect(readme).not.toContain('docs/assets/emp-v4-logo.png')
  })

  test('federation fox PNG asset system keeps transparent backgrounds', () => {
    for (const logoPath of [...websiteFederationFoxAssetPaths, ...docsFederationFoxAssetPaths]) {
      const logo = readPngRgba(logoPath)

      expect(logo).toMatchObject({
        width: 512,
        height: 512,
        bitDepth: 8,
        colorType: 6,
      })
      expect(logo.getPixel(0, 0).a).toBe(0)

      const opaquePixels = logo.countPixels(pixel => pixel.a > 200)
      const goldPixels = logo.countPixels(pixel => pixel.a > 200 && pixel.r > 220 && pixel.g > 130 && pixel.b < 90)
      const cyanPixels = logo.countPixels(pixel => pixel.a > 200 && pixel.r < 120 && pixel.g > 100 && pixel.b > 120)
      const nearBlackPixels = logo.countPixels(pixel => pixel.a > 200 && Math.max(pixel.r, pixel.g, pixel.b) < 80)

      expect(opaquePixels).toBeGreaterThan(12000)

      if (logoPath.includes('monochrome') || logoPath.includes('outline')) {
        expect(nearBlackPixels).toBeGreaterThan(1000)
      } else {
        expect(goldPixels).toBeGreaterThan(2000)
        expect(cyanPixels).toBeGreaterThan(1200)
      }
    }
  })

  test('theme stylesheet defines federation fox homepage tokens without theme eject', () => {
    const theme = readFileSync(websiteThemePath, 'utf8')

    expect(theme).toContain('--emp-hero-bg: #020b18')
    expect(theme).toContain('--emp-fox-orange: #f97316')
    expect(theme).toContain('--emp-electric-cyan: #22d3ee')
    expect(theme).toContain('--emp-logo-gold: #ffd84d')
    expect(theme).toContain('--emp-logo-orange: #f97316')
    expect(theme).toContain('--emp-logo-cyan: #22d3ee')
    expect(theme).toContain('--emp-logo-blue: #0ea5e9')
    expect(theme).toContain('--emp-logo-navy: #061225')
    expect(theme).toContain('--emp-page-bg: #f6fbff')
    expect(theme).toContain('--emp-page-bg: #030712')
    expect(theme).toContain('--emp-footer-bg: #f6fbff')
    expect(theme).toContain('--emp-footer-bg: #030712')
    expect(theme).toContain('--emp-footer-text: rgba(51, 81, 106, 0.68)')
    expect(theme).toContain('--emp-footer-text: rgba(226, 232, 240, 0.66)')
    expect(theme).toContain('--rp-c-bg: #f6fbff')
    expect(theme).toContain('--rp-c-bg: #030712')
    expect(theme).toContain('--emp-hero-wave-light:')
    expect(theme).toContain('--emp-hero-wave-dark:')
    expect(theme).toContain('--emp-hero-soft-transition-layer:')
    expect(theme).toContain('--emp-hero-spark-layer:')
    expect(theme).toContain('--emp-hero-mascot-aura:')
    expect(theme).toContain('--emp-nav-bg: rgba(246, 251, 255, 0.86)')
    expect(theme).toContain('--emp-nav-surface:')
    expect(theme).toContain('--emp-nav-divider: rgba(14, 165, 233, 0.18)')
    expect(theme).toContain('--emp-hero-text: #061225')
    expect(theme).toContain('--rp-c-brand')
    expect(theme).toContain('--emp-nav-bg: rgba(3, 7, 18, 0.78)')
    expect(theme).toContain('--emp-nav-divider: rgba(255, 216, 77, 0.16)')
    expect(theme).toContain('--emp-hero-text: #f8fafc')
    expect(theme).toContain('background: var(--emp-nav-surface) !important')
    expect(theme).toContain('background-color: var(--emp-nav-bg) !important')
    expect(theme).toContain('--emp-mobile-hero-image-size: 200px')
    expect(theme).toContain('--emp-feature-heading-copy: "现代微前端所需能力"')
    expect(theme).toContain('html[lang="en"]')
    expect(theme).toContain('--emp-feature-heading-copy: "Everything you need for modern micro frontends"')
    expect(theme).toContain('content: var(--emp-feature-heading-copy)')
    expect(theme).toContain('height: clamp(620px, calc(100vh - 76px), 700px)')
    expect(theme).toContain('padding: 36px 0 86px !important')
    expect(theme).toContain('grid-template-columns: minmax(0, 1fr);')
    expect(theme).toContain('justify-items: center;')
    expect(theme).toContain('text-align: center;')
    expect(theme).toContain('width: min(260px, 30vw)')
    expect(theme).toContain('background: var(--emp-hero-soft-transition-layer);')
    expect(theme).toContain('filter: blur(28px);')
    expect(theme).toContain('background: var(--emp-hero-mascot-aura);')
    expect(theme).toContain('height: 76px')
    expect(theme).toContain('padding: 0 32px !important')
    expect(theme).toContain('width: 178px')
    expect(theme).toContain('html body .rp-nav-hamburger__md')
    expect(theme).toContain('html body .rp-nav__others {')
    expect(theme).toContain('display: flex !important')
    expect(theme).toContain('border-bottom: 0 !important')
    expect(theme).toContain('border-left: 0')
    expect(theme).toContain('html.dark body .rp-search-button__hotkey')
    expect(theme).toContain('min-height: 600px')
    expect(theme).toContain('margin-top: -44px !important')
    expect(theme).toContain('.rp-nav__title__link::after')
    expect(theme).toContain('.rp-nav-screen-langs-group__inner')
    expect(theme).toContain('overflow: visible !important')
    expect(theme).not.toContain('.rp-home-hero__badge')
    expect(theme).not.toContain('.rp-home-hero__image::before')
    expect(theme).not.toContain('transparent 0 47%')
    expect(theme).not.toContain('transparent 0 56%')
    expect(theme).not.toContain('transparent 0 44%')
    expect(theme).not.toContain('transparent 0 60%')
    expect(theme).not.toContain('47.4% 62%')
    expect(theme).not.toContain('56.3% 65%')
    expect(theme).not.toContain('44.4%')
    expect(theme).not.toContain('60.3%')
    expect(theme).not.toContain('background: rgba(17, 17, 16, 0.94) !important')
    expect(theme).not.toContain('background: rgba(17, 17, 16, 0.96) !important')
    expect(theme).not.toContain('background-color: rgba(17, 17, 16, 0.96) !important')
    expect(theme).not.toContain('border-bottom: 1px solid var(--emp-nav-border) !important')
    expect(theme).not.toContain('border-left: 1px solid var(--emp-nav-divider)')
    expect(theme).toContain('.rp-home-hero__image')
    expect(theme).toContain('--emp-feature-icon-cube')
    expect(theme).toContain('--emp-feature-icon-bolt')
    expect(theme).toContain('--emp-feature-icon-ts')
    expect(theme).toContain('--emp-feature-icon-puzzle')
    expect(theme).toContain('.rp-home-feature__icon::before')
    expect(theme.match(/data:image\/svg\+xml/g)?.length ?? 0).toBeGreaterThanOrEqual(4)
    expect(theme).toContain('html body .rp-home-footer')
    expect(theme).toContain('color: var(--emp-footer-text);')
    expect(theme).toContain('.rp-home-hero::after')
    expect(theme).not.toContain('@tailwind')
  })

  test('documentation tree is bilingual and declarative', () => {
    const locales = readdirSync(websiteDocsPath, {withFileTypes: true})
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => name !== 'public')
      .sort()

    expect(locales).toEqual(['en', 'zh'])
    expect(existsSync(websiteEnHomePath)).toBe(true)
    expect(existsSync(websiteZhHomePath)).toBe(true)
    expect(existsSync(join(repoRoot, 'website/docs/public/emp-federation-fox-compact.png'))).toBe(true)

    for (const docPath of [
      join(websiteEnPath, 'guide/index.md'),
      join(websiteZhPath, 'guide/index.md'),
      join(websiteEnPath, 'guide/quick-start.md'),
      join(websiteZhPath, 'guide/quick-start.md'),
      join(websiteEnPath, 'migration/v4.md'),
      join(websiteZhPath, 'migration/v4.md'),
    ]) {
      const doc = readFileSync(docPath, 'utf8')

      expect(doc).not.toContain('@rc')
      expect(doc).not.toContain('rc 包')
      expect(doc).not.toContain('release candidate')
    }
  })

  test('top navigation matches the design reference labels and Chinese locale labels', () => {
    const config = readFileSync(websiteConfigPath, 'utf8')

    for (const label of ['Docs', 'Guide', 'Plugins', 'Examples', 'API', 'Changelog', 'Blog']) {
      expect(config).toContain(`text: '${label}'`)
    }
    for (const label of ['文档', '指南', '插件', '示例', 'API', '更新日志', '博客']) {
      expect(config).toContain(`text: '${label}'`)
    }
    expect(config).toContain("link: '/guide/index.html'")
    expect(config).toContain("link: '/faq/index.html'")
    expect(config).toContain("link: '/en/guide/index.html'")
    expect(config).toContain("link: '/en/faq/index.html'")
  })

  test('apps acceptance matrix publishes detailed verification tables', () => {
    const matrix = readFileSync(websiteAppsMatrixPath, 'utf8')
    const requiredCommands = [
      'corepack pnpm apps:acceptance',
      'corepack pnpm test:apps:single',
      'corepack pnpm test:apps:browser',
      'corepack pnpm test:tsconfig',
      'corepack pnpm empbuild',
      'corepack pnpm apps:check',
      'corepack pnpm test:library-output',
    ]
    const requiredApps = [
      'adapter-app',
      'adapter-host',
      'demo',
      'mf-host',
      'mf-app',
      'react-19-tanstack',
      'rspack2-modern-module',
      'rspack2-optimization',
      'tailwind-4',
      'vue-2-base',
      'vue-2-project',
      'vue-3-base',
      'vue-3-project',
    ]

    expect(matrix).toContain('## 验收链路')
    expect(matrix).toContain('## App 详细验收表')
    expect(matrix).toContain('## 边界验收')
    expect(matrix).toContain('| 验收项 | 命令 | 验收详细内容 | 通过标准 | 失败定位 |')
    expect(matrix).toContain('| App | 验收类型 | 验收详细内容 | 通过标准 | 测试证据 |')

    for (const command of requiredCommands) {
      expect(matrix).toContain(command)
    }

    for (const app of requiredApps) {
      expect(matrix).toContain(`| \`${app}\` |`)
    }
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
