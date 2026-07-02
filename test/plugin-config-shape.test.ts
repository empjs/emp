import {join} from 'node:path'
import {pathToFileURL} from 'node:url'
import {describe, expect, test} from '@rstest/core'

const repoRoot = process.cwd()

const importDist = async <T = any>(relativePath: string): Promise<T> => {
  const module = await import(pathToFileURL(join(repoRoot, relativePath)).href)
  return module.default
}

class DefinePlugin {
  options: Record<string, unknown>

  constructor(options: Record<string, unknown> = {}) {
    this.options = options
  }

  apply() {}
}

const createStore = async (options: {isDev?: boolean} = {}) => {
  const Chain = await importDist('packages/emp-chain/dist/index.js')
  const chain = new Chain()

  chain.module.rule('css').test(/\.css$/).use('postcss').loader('postcss-loader').end()
  chain.module
    .rule('sass')
    .test(/\.s[ac]ss$/)
    .use('postcss')
    .loader('postcss-loader')
    .end()
    .use('sassLoader')
    .loader('sass-loader')
    .end()
  chain.module
    .rule('less')
    .test(/\.less$/)
    .use('postcss')
    .loader('postcss-loader')
    .end()
    .use('lessLoader')
    .loader('less-loader')
    .end()
  chain.module.rule('javascript').test(/\.[jt]sx?$/).use('swc').loader('builtin:swc-loader').options({jsc: {}})
  chain.module.rule('typescript').test(/\.[jt]sx?$/).use('swc').loader('builtin:swc-loader').options({jsc: {}})
  chain.module.rule('svg').test(/\.svg$/).type('asset')
  chain.plugin('definePlugin').use(DefinePlugin, [{EXISTING_FLAG: true}])

  return {
    chain,
    chainName: {rule: {css: 'css'}},
    empConfig: {
      build: {polyfill: {browserslist: ['chrome 100']}},
      server: {port: 7331},
    },
    isDev: options.isDev ?? false,
    merge(config: Record<string, unknown>) {
      chain.merge(config)
    },
    root: repoRoot,
    uniqueName: 'plugin_config_test',
  }
}

type PluginStore = Awaited<ReturnType<typeof createStore>>

const configFrom = async (plugin: {rsConfig(store: PluginStore): Promise<void>}, store = createStore()) => {
  const resolvedStore = await store
  await plugin.rsConfig(resolvedStore)
  return resolvedStore.chain.toConfig()
}

const pluginFrom = async (relativePath: string, options?: Record<string, unknown>) => {
  const factory = await importDist(relativePath)
  return factory(options)
}

const pluginWithoutOptions = async (relativePath: string) => {
  const factory = await importDist(relativePath)
  return factory()
}

const ruleByTest = (config: any, testPattern: RegExp) => {
  const rule = config.module.rules.find((candidate: any) => String(candidate.test) === String(testPattern))
  expect(rule).toBeTruthy()
  return rule
}

const useByLoader = (rule: any, loaderPart: string) => rule.use?.find((use: any) => String(use.loader).includes(loaderPart))

const useIndex = (rule: any, loaderPart: string) =>
  rule.use?.findIndex((use: any) => String(use.loader).includes(loaderPart)) ?? -1

describe('plugin config shape coverage', () => {
  test('plugin-lightningcss injects transform loader, removes PostCSS by default, and registers minifier', async () => {
    const config = await configFrom(await pluginFrom('packages/plugin-lightningcss/dist/index.js', {transform: true}))
    const cssRule = ruleByTest(config, /\.css$/)
    const sassRule = ruleByTest(config, /\.s[ac]ss$/)
    const lessRule = ruleByTest(config, /\.less$/)

    for (const rule of [cssRule, sassRule, lessRule]) {
      const lightningcssUse = useByLoader(rule, 'plugin-lightningcss/dist/loader.js')
      expect(lightningcssUse).toBeTruthy()
      expect(lightningcssUse.options.targets.chrome).toBeGreaterThan(0)
      expect(useByLoader(rule, 'postcss-loader')).toBeFalsy()
    }

    expect(useIndex(sassRule, 'plugin-lightningcss/dist/loader.js')).toBeLessThan(useIndex(sassRule, 'sass-loader'))
    expect(useIndex(lessRule, 'plugin-lightningcss/dist/loader.js')).toBeLessThan(useIndex(lessRule, 'less-loader'))
    expect(config.optimization.minimizer[0].name).toBe('LightningCSSMinifyPlugin')
    expect(config.optimization.minimizer[0].options.targets.chrome).toBeGreaterThan(0)
  })

  test('plugin-lightningcss keeps PostCSS when enablePostcss is true', async () => {
    const config = await configFrom(
      await pluginFrom('packages/plugin-lightningcss/dist/index.js', {enablePostcss: true, minify: false, transform: true}),
    )
    const cssRule = ruleByTest(config, /\.css$/)

    expect(useByLoader(cssRule, 'plugin-lightningcss/dist/loader.js')).toBeTruthy()
    expect(useByLoader(cssRule, 'postcss-loader')).toBeTruthy()
    expect(config.optimization).toBeUndefined()
  })

  test('plugin-postcss injects postcss-loader before Sass and Less compilers', async () => {
    const config = await configFrom(
      await pluginFrom('packages/plugin-postcss/dist/index.js', {postcssOptions: {plugins: ['autoprefixer']}}),
    )
    const cssRule = ruleByTest(config, /\.css$/)
    const sassRule = ruleByTest(config, /\.s[ac]ss$/)
    const lessRule = ruleByTest(config, /\.less$/)

    expect(useByLoader(cssRule, 'postcss-loader').options.postcssOptions.plugins).toEqual(['autoprefixer'])
    expect(useIndex(sassRule, 'postcss-loader')).toBeLessThan(useIndex(sassRule, 'sass-loader'))
    expect(useIndex(lessRule, 'postcss-loader')).toBeLessThan(useIndex(lessRule, 'less-loader'))
  })

  test('plugin-stylus adds a real .styl rule with expected loader order and options', async () => {
    const config = await configFrom(await pluginWithoutOptions('packages/plugin-stylus/dist/index.js'))
    const stylusRule = ruleByTest(config, /\.styl$/)

    expect(useIndex(stylusRule, 'style-loader')).toBe(0)
    expect(useIndex(stylusRule, 'css-loader')).toBe(1)
    expect(useIndex(stylusRule, 'stylus-loader')).toBe(2)
    expect(useByLoader(stylusRule, 'stylus-loader').options.stylusOptions).toMatchObject({
      compress: true,
      includeCSS: false,
      lineNumbers: true,
      resolveURL: true,
    })
  })

  test('plugin-tailwindcss wires Tailwind into the canonical css rule', async () => {
    const config = await configFrom(
      await pluginFrom('packages/plugin-tailwindcss/dist/index.js', {base: '/tmp/tailwind-root', optimize: true}),
      createStore({isDev: true}),
    )
    const cssRule = ruleByTest(config, /\.css$/)
    const tailwindUse = useByLoader(cssRule, '@tailwindcss')

    expect(cssRule.type).toBe('css')
    expect(tailwindUse).toBeTruthy()
    expect(tailwindUse.options).toEqual({base: '/tmp/tailwind-root', optimize: true})
  })

  test('plugin-vue2 wires Vue 2 loader, jsx transform, svg assets, and runtime alias', async () => {
    const config = await configFrom(await pluginWithoutOptions('packages/plugin-vue2/dist/index.js'))
    const vueRule = ruleByTest(config, /\.vue$/)
    const jtsxRule = ruleByTest(config, /\.(jsx|tsx)$/)

    expect(config.resolve.alias['vue$']).toBe('vue/dist/vue.runtime.esm.js')
    expect(config.plugins.some((plugin: any) => plugin?.constructor?.name === 'VueLoaderPlugin')).toBe(true)
    expect(useByLoader(vueRule, 'vue-loader')).toBeTruthy()
    expect(useByLoader(vueRule, 'vue-loader').options).toMatchObject({
      experimentalInlineMatchResource: true,
      library: 'plugin_config_test_emp_hmr_7331',
    })
    expect(useByLoader(vueRule, 'vue-svg-inline-loader')).toBeTruthy()
    expect(useByLoader(jtsxRule, 'babel-loader').options.presets[0][0]).toContain('@vue/babel-preset-jsx')
    expect(ruleByTest(config, /\.svg$/).type).toBe('asset/resource')
    expect(ruleByTest(config, /\.js$/)).toBeTruthy()
    expect(ruleByTest(config, /\.ts$/)).toBeTruthy()
  })

  test('plugin-vue3 wires Vue 3 loader, jsx transform, svg assets, and feature flags', async () => {
    const config = await configFrom(await pluginWithoutOptions('packages/plugin-vue3/dist/index.js'))
    const vueRule = ruleByTest(config, /\.vue$/)
    const jtsxRule = ruleByTest(config, /\.(jsx|tsx)$/)
    const definePlugin = config.plugins.find((plugin: any) => plugin instanceof DefinePlugin)

    expect(useByLoader(vueRule, 'vue-loader')).toBeTruthy()
    expect(useByLoader(vueRule, 'vue-loader').options).toMatchObject({
      experimentalInlineMatchResource: true,
      library: 'plugin_config_test_emp_hmr_7331',
    })
    expect(useByLoader(jtsxRule, 'babel-loader').options.presets[0][0]).toContain('@babel/preset-typescript')
    expect(useByLoader(jtsxRule, 'babel-loader').options.plugins[0][0]).toContain('@vue/babel-plugin-jsx')
    expect(ruleByTest(config, /\.svg$/).type).toBe('asset/resource')
    expect(ruleByTest(config, /\.js$/)).toBeTruthy()
    expect(ruleByTest(config, /\.ts$/)).toBeTruthy()
    expect(definePlugin.options).toMatchObject({
      __VUE_OPTIONS_API__: true,
      __VUE_PROD_DEVTOOLS__: false,
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false,
      EXISTING_FLAG: true,
    })
  })
})
