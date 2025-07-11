import { describe, it, expect, beforeEach } from 'bun:test'
import Config from '../src/Config'

class MockHtmlPlugin {
  constructor(public options: any = {}) {}
}

class MockMiniCssExtractPlugin {
  constructor(public options: any = {}) {}
}

class MockCleanPlugin {
  constructor(public options: any = {}) {}
}

describe('Integration Tests', () => {
  let config: Config

  beforeEach(() => {
    config = new Config()
  })

  describe('Complete webpack configuration', () => {
    it('should create a complete development configuration', () => {
      config
        .mode('development')
        .context('/app')
        .devtool('eval-source-map')
        .target('web')
        .entry('main')
          .add('src/index.js')
          .add('src/polyfills.js')
          .end()
        .entry('vendor')
          .add('react')
          .add('react-dom')
          .end()
        .output
          .path('/dist')
          .filename('[name].bundle.js')
          .publicPath('/assets/')
          .end()
        .resolve
          .extensions
            .add('.js')
            .add('.jsx')
            .add('.ts')
            .add('.tsx')
            .end()
          .alias
            .set('@', 'src')
            .set('components', 'src/components')
            .set('utils', 'src/utils')
            .end()
          .end()
        .module
          .rule('javascript')
            .test(/\.(js|jsx)$/)
            .include
              .add('src')
              .add('lib')
              .end()
            .exclude
              .add('node_modules')
              .end()
            .use('babel')
              .loader('babel-loader')
              .options({
                presets: ['@babel/preset-env', '@babel/preset-react'],
                plugins: ['@babel/plugin-proposal-class-properties']
              })
              .end()
            .end()
          .rule('typescript')
            .test(/\.(ts|tsx)$/)
            .include
              .add('src')
              .end()
            .use('typescript')
              .loader('ts-loader')
              .options({ transpileOnly: true })
              .end()
            .end()
          .rule('css')
            .test(/\.css$/)
            .use('style')
              .loader('style-loader')
              .end()
            .use('css')
              .loader('css-loader')
              .options({ modules: true })
              .end()
            .end()
          .end()
        .plugin('html')
          .use(MockHtmlPlugin, [{
            template: 'public/index.html',
            inject: true
          }])
          .end()
        .devServer
          .port(3000)
          .host('localhost')
          .hot(true)
          .open(true)
          .historyApiFallback(true)
          .end()
        .optimization
          .splitChunks({
            chunks: 'all',
            cacheGroups: {
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                chunks: 'all'
              }
            }
          })
          .end()
      
      const webpackConfig = config.toConfig()
      
      // Verify basic configuration
      expect(webpackConfig.mode).toBe('development')
      expect(webpackConfig.context).toBe('/app')
      expect(webpackConfig.devtool).toBe('eval-source-map')
      expect(webpackConfig.target).toBe('web')
      
      // Verify entries
      expect(webpackConfig.entry.main).toEqual(['src/index.js', 'src/polyfills.js'])
      expect(webpackConfig.entry.vendor).toEqual(['react', 'react-dom'])
      
      // Verify output
      expect(webpackConfig.output.path).toBe('/dist')
      expect(webpackConfig.output.filename).toBe('[name].bundle.js')
      expect(webpackConfig.output.publicPath).toBe('/assets/')
      
      // Verify resolve
      expect(webpackConfig.resolve.extensions).toEqual(['.js', '.jsx', '.ts', '.tsx'])
      expect(webpackConfig.resolve.alias).toEqual({
        '@': 'src',
        'components': 'src/components',
        'utils': 'src/utils'
      })
      
      // Verify module rules
      expect(webpackConfig.module.rules).toHaveLength(3)
      
      const jsRule = webpackConfig.module.rules[0]
      expect(jsRule.test).toEqual(/\.(js|jsx)$/)
      expect(jsRule.include).toEqual(['src', 'lib'])
      expect(jsRule.exclude).toEqual(['node_modules'])
      expect(jsRule.use[0].loader).toBe('babel-loader')
      
      const tsRule = webpackConfig.module.rules[1]
      expect(tsRule.test).toEqual(/\.(ts|tsx)$/)
      expect(tsRule.use[0].loader).toBe('ts-loader')
      
      const cssRule = webpackConfig.module.rules[2]
      expect(cssRule.test).toEqual(/\.css$/)
      expect(cssRule.use).toHaveLength(2)
      
      // Verify plugins
      expect(webpackConfig.plugins).toHaveLength(1)
      expect(webpackConfig.plugins[0]).toBeInstanceOf(MockHtmlPlugin)
      
      // Verify devServer
      expect(webpackConfig.devServer.port).toBe(3000)
      expect(webpackConfig.devServer.host).toBe('localhost')
      expect(webpackConfig.devServer.hot).toBe(true)
      
      // Verify optimization
      expect(webpackConfig.optimization.splitChunks.chunks).toBe('all')
    })

    it('should create a complete production configuration', () => {
      config
        .mode('production')
        .devtool('source-map')
        .entry('app').add('src/index.js').end()
        .output
          .path('/dist')
          .filename('[name].[contenthash].js')
          .chunkFilename('[name].[contenthash].chunk.js')
          .publicPath('/static/')
          .end()
        .module
          .rule('css')
            .test(/\.css$/)
            .use('extract')
              .loader('mini-css-extract-plugin-loader')
              .end()
            .use('css')
              .loader('css-loader')
              .end()
            .use('postcss')
              .loader('postcss-loader')
              .end()
            .end()
          .rule('images')
            .test(/\.(png|jpe?g|gif|svg)$/)
            .type('asset')
            .parser({ dataUrlCondition: { maxSize: 8192 } })
            .generator({
              filename: 'images/[name].[hash][ext]'
            })
            .end()
          .end()
        .plugin('clean')
          .use(MockCleanPlugin)
          .end()
        .plugin('css-extract')
          .use(MockMiniCssExtractPlugin, [{
            filename: '[name].[contenthash].css',
            chunkFilename: '[name].[contenthash].chunk.css'
          }])
          .end()
        .optimization
          .minimize(true)
          .splitChunks({
            chunks: 'all',
            cacheGroups: {
              default: {
                minChunks: 2,
                priority: -20,
                reuseExistingChunk: true
              },
              vendor: {
                test: /[\\/]node_modules[\\/]/,
                name: 'vendors',
                priority: -10,
                chunks: 'all'
              }
            }
          })
          .runtimeChunk('single')
          .end()
      
      const webpackConfig = config.toConfig()
      
      expect(webpackConfig.mode).toBe('production')
      expect(webpackConfig.devtool).toBe('source-map')
      expect(webpackConfig.output.filename).toBe('[name].[contenthash].js')
      expect(webpackConfig.optimization.minimize).toBe(true)
      expect(webpackConfig.optimization.runtimeChunk).toBe('single')
      expect(webpackConfig.plugins).toHaveLength(2)
    })
  })

  describe('Configuration merging', () => {
    it('should merge configurations correctly', () => {
      const baseConfig = new Config()
      baseConfig
        .mode('development')
        .entry('main').add('src/index.js').end()
        .output.path('/dist').end()
        .resolve.extensions.add('.js').end()
      
      const extendedConfig = new Config()
      extendedConfig
        .mode('production')
        .entry('vendor').add('react').end()
        .output.filename('[name].[hash].js').end()
        .resolve.extensions.add('.ts').end()
        .plugin('html').use(MockHtmlPlugin).end()
      
      baseConfig.merge(extendedConfig.toConfig())
      
      const finalConfig = baseConfig.toConfig()
      
      expect(finalConfig.mode).toBe('production')
      expect(finalConfig.entry.main).toEqual(['src/index.js'])
      expect(finalConfig.entry.vendor).toEqual(['react'])
      expect(finalConfig.output.path).toBe('/dist')
      expect(finalConfig.output.filename).toBe('[name].[hash].js')
      expect(finalConfig.resolve.extensions).toContain('.js')
      expect(finalConfig.resolve.extensions).toContain('.ts')
      expect(finalConfig.plugins).toHaveLength(1)
    })
  })

  describe('Plugin ordering', () => {
    it('should respect plugin ordering', () => {
      config
        .plugin('html')
          .use(MockHtmlPlugin)
          .before('clean')
          .end()
        .plugin('clean')
          .use(MockCleanPlugin)
          .after('html')
          .end()
        .plugin('css-extract')
          .use(MockMiniCssExtractPlugin)
          .before('html')
          .end()
      
      const plugins = config.plugins.entries()
      
      expect(plugins.html.get('__before')).toBe('clean')
      expect(plugins.clean.get('__after')).toBe('html')
      expect(plugins['css-extract'].get('__before')).toBe('html')
    })
  })

  describe('Rule ordering', () => {
    it('should respect rule ordering', () => {
      config.module
        .rule('eslint')
          .test(/\.(js|jsx)$/)
          .enforce('pre')
          .use('eslint').loader('eslint-loader').end()
          .before('javascript')
          .end()
        .rule('javascript')
          .test(/\.(js|jsx)$/)
          .use('babel').loader('babel-loader').end()
          .after('eslint')
          .end()
        .rule('typescript')
          .test(/\.(ts|tsx)$/)
          .use('typescript').loader('ts-loader').end()
          .after('javascript')
          .end()
      
      const rules = config.module.rules.entries()
      
      expect(rules.eslint.get('__before')).toBe('javascript')
      expect(rules.javascript.get('__after')).toBe('eslint')
      expect(rules.typescript.get('__after')).toBe('javascript')
    })
  })

  describe('Complex chaining scenarios', () => {
    it('should handle deep nesting and chaining', () => {
      const result = config
        .mode('development')
        .entry('main')
          .add('src/index.js')
          .when(true, entry => {
            entry.add('src/dev-tools.js')
          })
          .end()
        .module
          .rule('javascript')
            .test(/\.js$/)
            .include.add('src').end()
            .exclude.add('node_modules').end()
            .use('babel')
              .loader('babel-loader')
              .options({ presets: ['@babel/preset-env'] })
              .tap(args => {
                args[0].plugins = ['@babel/plugin-proposal-class-properties']
                return args
              })
              .end()
            .oneOf('inline')
              .resourceQuery(/\?inline/)
              .use('raw').loader('raw-loader').end()
              .end()
            .end()
          .end()
        .plugin('html')
          .use(MockHtmlPlugin, [{ template: 'index.html' }])
          .tap(args => {
            args[0].minify = false
            return args
          })
          .end()
        .when(process.env.NODE_ENV === 'development', config => {
          config.devServer.hot(true)
        })
      
      expect(result).toBe(config)
      
      const webpackConfig = config.toConfig()
      expect(webpackConfig.entry.main).toContain('src/index.js')
      expect(webpackConfig.entry.main).toContain('src/dev-tools.js')
      
      const jsRule = webpackConfig.module.rules[0]
      expect(jsRule.use[0].options.plugins).toEqual(['@babel/plugin-proposal-class-properties'])
      expect(jsRule.oneOf).toHaveLength(1)
      
      const htmlPlugin = webpackConfig.plugins[0]
      expect(htmlPlugin.options.minify).toBe(false)
    })
  })

  describe('Error handling and edge cases', () => {
    it('should handle empty configuration gracefully', () => {
      const webpackConfig = config.toConfig()
      expect(typeof webpackConfig).toBe('object')
      expect(webpackConfig.entry).toBeUndefined()
      expect(webpackConfig.module?.rules).toEqual([])
      expect(webpackConfig.plugins).toEqual([])
    })

    it('should handle configuration with only some sections', () => {
      config
        .mode('production')
        .output.filename('[name].js').end()
      
      const webpackConfig = config.toConfig()
      expect(webpackConfig.mode).toBe('production')
      expect(webpackConfig.output.filename).toBe('[name].js')
      expect(webpackConfig.entry).toBeUndefined()
      expect(webpackConfig.module?.rules).toEqual([])
    })

    it('should handle plugin tap errors gracefully', () => {
      config.plugin('html').use(MockHtmlPlugin, [{ template: 'index.html' }])
      
      expect(() => {
        config.plugins.get('html').tap(() => {
          throw new Error('Tap error')
        })
      }).toThrow('Tap error')
    })
  })

  describe('toString functionality', () => {
    it('should generate readable string representation', () => {
      config
        .mode('development')
        .entry('main').add('src/index.js').end()
        .output.path('/dist').filename('[name].js').end()
        .plugin('html').use(MockHtmlPlugin).end()
      
      const configString = config.toString()
      
      expect(typeof configString).toBe('string')
      expect(configString).toContain('mode')
      expect(configString).toContain('development')
      expect(configString).toContain('entry')
      expect(configString).toContain('output')
    })
  })

  describe('Performance and memory', () => {
    it('should handle large configurations efficiently', () => {
      const startTime = Date.now()
      
      // Create a large configuration
      for (let i = 0; i < 100; i++) {
        config.entry(`entry-${i}`).add(`src/entry-${i}.js`)
        config.module.rule(`rule-${i}`).test(new RegExp(`\\.${i}$`))
        config.plugin(`plugin-${i}`).use(MockHtmlPlugin, [{ id: i }])
      }
      
      const webpackConfig = config.toConfig()
      const endTime = Date.now()
      
      expect(Object.keys(webpackConfig.entry)).toHaveLength(100)
      expect(webpackConfig.module.rules).toHaveLength(100)
      expect(webpackConfig.plugins).toHaveLength(100)
      expect(endTime - startTime).toBeLessThan(1000) // Should complete within 1 second
    })
  })
})