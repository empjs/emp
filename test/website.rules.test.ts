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
const websiteZhPath = join(websiteDocsPath, 'zh')
const websiteHomePath = join(websiteZhPath, 'index.mdx')
const websiteNavPath = join(websiteZhPath, '_nav.json')
const websiteAppsMatrixPath = join(websiteZhPath, 'examples/apps-matrix.md')
const websiteLogoPath = join(websiteDocsPath, 'public/emp-v4-logo.png')
const websiteLogoSvgPath = join(websiteDocsPath, 'public/emp-v4-logo.svg')
const docsLogoPath = join(repoRoot, 'docs/assets/emp-v4-logo.png')
const docsLogoSvgPath = join(repoRoot, 'docs/assets/emp-v4-logo.svg')

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
      '27 篇中文文档',
    ]) {
      expect(home).toContain(requiredMarker)
    }

    expect(parsed.frontmatter.pageType).toBe('home')
    expect(parsed.frontmatter.hero?.name).toBe('EMP v4')
    expect(parsed.frontmatter.titleSuffix).toBe('高性能、微前端构建')
    expect(parsed.frontmatter.hero?.text).toBe('高性能、微前端构建')
    expect(parsed.frontmatter.features).toHaveLength(6)
    expect(featureCount).toBeGreaterThanOrEqual(6)
    expect(existsSync(join(websiteZhPath, 'index.md'))).toBe(false)
    expect(home).not.toContain('class="emp-home"')
    expect(home).not.toContain('data-section=')
    expect(home).not.toContain('<section')
    expect(home).not.toContain('<article')
    expect(existsSync(join(websiteDocsPath, 'styles/home.css'))).toBe(false)
  })

  test('EMP v4 logo assets keep transparent PNG backgrounds without black matte pixels', () => {
    for (const logoPath of [websiteLogoPath, docsLogoPath]) {
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

      expect(opaquePixels).toBeGreaterThan(30000)
      expect(goldPixels).toBeGreaterThan(8000)
      expect(cyanPixels).toBeGreaterThan(8000)
      expect(nearBlackPixels).toBe(0)
    }
  })

  test('EMP v4 logo has a repo-native SVG source instead of a raster-only edit', () => {
    const websiteSvg = readFileSync(websiteLogoSvgPath, 'utf8')
    const docsSvg = readFileSync(docsLogoSvgPath, 'utf8')

    expect(websiteSvg).toBe(docsSvg)
    expect(websiteSvg).toContain('<svg')
    expect(websiteSvg).toContain('viewBox="0 0 512 512"')
    expect(websiteSvg).toContain('data-logo-source="emp-v4-generated"')
    expect(websiteSvg).not.toContain('url(')
    expect(websiteSvg).not.toMatch(/<image\b|href=|data:image|base64|#000000|#000\b/i)
  })

  test('documentation tree is Chinese-only and declarative', () => {
    const locales = readdirSync(websiteDocsPath, {withFileTypes: true})
      .filter(entry => entry.isDirectory())
      .map(entry => entry.name)
      .filter(name => name !== 'public')

    expect(locales).toEqual(['zh'])
    expect(existsSync(websiteNavPath)).toBe(true)
    expect(existsSync(join(websiteDocsPath, 'en'))).toBe(false)
    expect(existsSync(join(repoRoot, 'website/docs/public/emp-v4-logo.png'))).toBe(true)
  })

  test('top navigation only surfaces functional documentation labels', () => {
    const nav = readJson<Array<{text: string; link: string}>>(websiteNavPath)
    const hiddenUtilityLabels = ['首页', '示例', '迁移', '问答', '发布']

    expect(nav.map(item => item.text)).toEqual(['入门', '核心', '插件', '配置'])

    for (const item of nav) {
      expect(item.text).toMatch(/^[\u4e00-\u9fa5]{2}$/)
    }

    for (const label of hiddenUtilityLabels) {
      expect(nav.some(item => item.text === label || item.text.includes(label))).toBe(false)
    }
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
