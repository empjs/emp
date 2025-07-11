import { describe, it, expect, beforeEach } from 'bun:test'
import Config from '../src/Config'
import Plugin from '../src/Plugin'
import Rule from '../src/Rule'

describe('Config', () => {
  let config: Config

  beforeEach(() => {
    config = new Config()
  })

  describe('basic configuration', () => {
    it('should create a new Config instance', () => {
      expect(config).toBeInstanceOf(Config)
    })

    it('should set and get mode', () => {
      config.mode('development')
      expect(config.get('mode')).toBe('development')
    })

    it('should set and get context', () => {
      config.context('/path/to/context')
      expect(config.get('context')).toBe('/path/to/context')
    })

    it('should set and get devtool', () => {
      config.devtool('source-map')
      expect(config.get('devtool')).toBe('source-map')
    })

    it('should set and get target', () => {
      config.target('web')
      expect(config.get('target')).toBe('web')
    })

    it('should set and get name', () => {
      config.name('my-app')
      expect(config.get('name')).toBe('my-app')
    })
  })

  describe('entry configuration', () => {
    it('should add entry points', () => {
      config.entry('main').add('src/index.js')
      config.entry('vendor').add('src/vendor.js')
      
      const entries = config.entryPoints.entries()
      expect(entries).toHaveProperty('main')
      expect(entries).toHaveProperty('vendor')
    })

    it('should clear entry points', () => {
      config.entry('main').add('src/index.js')
      config.entry('main').clear()
      
      expect(config.entry('main').values()).toEqual([])
    })
  })

  describe('plugin configuration', () => {
    it('should add plugins', () => {
      config.plugin('html').use('HtmlWebpackPlugin', [{ template: 'index.html' }])
      
      const plugins = config.plugins.entries()
      expect(plugins).toHaveProperty('html')
      expect(plugins.html).toBeInstanceOf(Plugin)
    })

    it('should delete plugins', () => {
      config.plugin('html').use('HtmlWebpackPlugin')
      config.plugins.delete('html')
      
      const plugins = config.plugins.entries()
      expect(plugins).not.toHaveProperty('html')
    })
  })

  describe('module configuration', () => {
    it('should add rules', () => {
      config.module.rule('js')
        .test(/\.js$/)
        .use('babel')
        .loader('babel-loader')
        .options({ presets: ['@babel/preset-env'] })
      
      const rules = config.module.rules.entries()
      expect(rules).toHaveProperty('js')
      expect(rules.js).toBeInstanceOf(Rule)
    })

    it('should configure multiple rules', () => {
      config.module.rule('js').test(/\.js$/)
      config.module.rule('css').test(/\.css$/)
      config.module.rule('ts').test(/\.ts$/)
      
      const rules = config.module.rules.entries()
      expect(Object.keys(rules)).toHaveLength(3)
    })
  })

  describe('resolve configuration', () => {
    it('should add extensions', () => {
      config.resolve.extensions.add('.js').add('.ts').add('.jsx')
      
      expect(config.resolve.extensions.values()).toEqual(['.js', '.ts', '.jsx'])
    })

    it('should add aliases', () => {
      config.resolve.alias.set('@', 'src')
      config.resolve.alias.set('components', 'src/components')
      
      expect(config.resolve.alias.get('@')).toBe('src')
      expect(config.resolve.alias.get('components')).toBe('src/components')
    })
  })

  describe('output configuration', () => {
    it('should configure output path and filename', () => {
      config.output
        .path('/dist')
        .filename('[name].[hash].js')
        .publicPath('/assets/')
      
      expect(config.output.get('path')).toBe('/dist')
      expect(config.output.get('filename')).toBe('[name].[hash].js')
      expect(config.output.get('publicPath')).toBe('/assets/')
    })
  })

  describe('devServer configuration', () => {
    it('should configure dev server', () => {
      config.devServer
        .port(3000)
        .host('localhost')
        .hot(true)
        .open(true)
      
      expect(config.devServer.get('port')).toBe(3000)
      expect(config.devServer.get('host')).toBe('localhost')
      expect(config.devServer.get('hot')).toBe(true)
      expect(config.devServer.get('open')).toBe(true)
    })
  })

  describe('optimization configuration', () => {
    it('should configure optimization settings', () => {
      config.optimization
        .minimize(true)
        .splitChunks({ chunks: 'all' })
      
      expect(config.optimization.get('minimize')).toBe(true)
      expect(config.optimization.get('splitChunks')).toEqual({ chunks: 'all' })
    })
  })

  describe('toConfig method', () => {
    it('should generate webpack config object', () => {
      config
        .mode('development')
        .context('/app')
        .entry('main').add('src/index.js').end()
        .output.path('/dist').filename('[name].js').end()
        .resolve.extensions.add('.js').add('.ts')
      
      const webpackConfig = config.toConfig()
      
      expect(webpackConfig.mode).toBe('development')
      expect(webpackConfig.context).toBe('/app')
      expect(webpackConfig.entry).toHaveProperty('main')
      expect(webpackConfig.output).toHaveProperty('path', '/dist')
      expect(webpackConfig.output).toHaveProperty('filename', '[name].js')
      expect(webpackConfig.resolve).toHaveProperty('extensions')
    })

    it('should handle empty configuration', () => {
      const webpackConfig = config.toConfig()
      expect(typeof webpackConfig).toBe('object')
    })
  })

  describe('merge method', () => {
    it('should merge configurations', () => {
      const config1 = new Config()
      config1.mode('development')
      config1.entry('main').add('src/index.js')
      
      const config2 = new Config()
      config2.mode('production')
      config2.output.path('/dist')
      
      config1.merge(config2.toConfig())
      
      expect(config1.get('mode')).toBe('production')
      expect(config1.output.get('path')).toBe('/dist')
    })
  })

  describe('toString method', () => {
    it('should generate string representation', () => {
      config
        .mode('development')
        .entry('main').add('src/index.js').end()
        .output.path('/dist')
      
      const configString = config.toString()
      expect(typeof configString).toBe('string')
      expect(configString).toContain('mode')
      expect(configString).toContain('development')
    })
  })

  describe('chaining', () => {
    it('should support method chaining', () => {
      const result = config
        .mode('development')
        .context('/app')
        .target('web')
        .name('my-app')
      
      expect(result).toBe(config)
      expect(config.get('mode')).toBe('development')
      expect(config.get('context')).toBe('/app')
      expect(config.get('target')).toBe('web')
      expect(config.get('name')).toBe('my-app')
    })
  })
})