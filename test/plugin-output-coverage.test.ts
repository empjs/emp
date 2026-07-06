import {createRequire} from 'node:module'
import {readFileSync} from 'node:fs'
import {join} from 'node:path'
import {pathToFileURL} from 'node:url'
import postcssProcessor from 'postcss'
import {transform} from 'lightningcss'
import {describe, expect, test} from '@rstest/core'
import {repoRoot} from './helpers/repo-root'

const require = createRequire(import.meta.url)

const importDist = async <T = any>(relativePath: string): Promise<T> => {
  return import(pathToFileURL(join(repoRoot, relativePath)).href) as Promise<T>
}

const loadPostcssPlugin = async ([modulePath, options]: [string, Record<string, unknown>]) => {
  try {
    const module = await import(pathToFileURL(modulePath).href)
    const factory = module.default ?? module
    return factory(options)
  } catch {
    const factory = require(modulePath)
    return factory(options)
  }
}

const runPostcss = async (pluginTuple: [string, Record<string, unknown>], css: string) => {
  const plugin = await loadPostcssPlugin(pluginTuple)
  const result = await postcssProcessor([plugin]).process(css, {from: undefined})
  return result.css
}

const runLightningcss = (visitor: any, css: string) => {
  const result = transform({
    filename: 'plugin-output.css',
    code: Buffer.from(css),
    minify: false,
    visitor,
  })
  return result.code.toString()
}

describe('plugin output coverage', () => {
  test('plugin-postcss unit helpers produce real rem and viewport CSS output', async () => {
    const {postcss} = await importDist<typeof import('../packages/plugin-postcss/dist/index.js')>(
      'packages/plugin-postcss/dist/index.js',
    )

    const remCss = await runPostcss(
      postcss.pxtorem({rootValue: 10}),
      '.card { width: 20px; border-width: 1px; }',
    )
    expect(remCss).toContain('width: 2rem')
    expect(remCss).toContain('border-width: 0.1rem')

    const vwCss = await runPostcss(
      postcss.pxtovw({viewportWidth: 320, unitPrecision: 5}),
      '.card { width: 160px; font-size: 16px; }',
    )
    expect(vwCss).toContain('width: 50vw')
    expect(vwCss).toContain('font-size: 5vw')
  })

  test('plugin-lightningcss unit visitors produce real rem and viewport CSS output', async () => {
    const {postcss} = await importDist<typeof import('../packages/plugin-lightningcss/dist/index.js')>(
      'packages/plugin-lightningcss/dist/index.js',
    )

    const remCss = runLightningcss(postcss.px_to_rem({rootValue: 10}), '.card { width: 20px; margin: 5px; }')
    expect(remCss).toContain('width: 2rem')
    expect(remCss).toContain('margin: .5rem')

    const vwCss = runLightningcss(
      postcss.px_to_viewport({viewportWidth: 320, unitPrecision: 5}),
      '.card { width: 160px; font-size: 16px; }',
    )
    expect(vwCss).toContain('width: 50vw')
    expect(vwCss).toContain('font-size: 5vw')
  })

  test('plugin-tailwindcss coverage is scoped to the current Tailwind 4 package line', () => {
    const tailwindPkg = JSON.parse(readFileSync(join(repoRoot, 'packages/plugin-tailwindcss/package.json'), 'utf8'))
    const rootPkg = JSON.parse(readFileSync(join(repoRoot, 'package.json'), 'utf8'))

    expect(tailwindPkg.dependencies?.tailwindcss).toBe('4.3.1')
    expect(tailwindPkg.dependencies?.['@tailwindcss/webpack']).toBe('4.3.1')
    expect(rootPkg.devDependencies?.['@empjs/plugin-tailwindcss2']).toBeUndefined()
    expect(rootPkg.devDependencies?.['@empjs/plugin-tailwindcss3']).toBeUndefined()
  })
})
