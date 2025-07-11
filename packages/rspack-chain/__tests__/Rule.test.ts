import { describe, it, expect, beforeEach } from 'bun:test'
import Rule from '../src/Rule'
import Use from '../src/Use'

describe('Rule', () => {
  let rule: Rule

  beforeEach(() => {
    rule = new Rule()
  })

  describe('basic operations', () => {
    it('should create a new Rule instance', () => {
      expect(rule).toBeInstanceOf(Rule)
    })

    it('should be orderable', () => {
      expect(typeof rule.before).toBe('function')
      expect(typeof rule.after).toBe('function')
    })
  })

  describe('test configuration', () => {
    it('should set test regex', () => {
      rule.test(/\.js$/)
      expect(rule.get('test')).toEqual(/\.js$/)
    })

    it('should set test string', () => {
      rule.test('.js')
      expect(rule.get('test')).toBe('.js')
    })

    it('should set test function', () => {
      const testFn = (path: string) => path.endsWith('.js')
      rule.test(testFn)
      expect(rule.get('test')).toBe(testFn)
    })

    it('should return rule instance for chaining', () => {
      const result = rule.test(/\.js$/)
      expect(result).toBe(rule)
    })
  })

  describe('include configuration', () => {
    it('should add include paths', () => {
      rule.include.add('src')
      rule.include.add('lib')
      
      expect(rule.include.values()).toEqual(['src', 'lib'])
    })

    it('should support include chaining', () => {
      const result = rule.include.add('src').add('lib')
      expect(result).toBe(rule.include)
    })
  })

  describe('exclude configuration', () => {
    it('should add exclude paths', () => {
      rule.exclude.add('node_modules')
      rule.exclude.add('dist')
      
      expect(rule.exclude.values()).toEqual(['node_modules', 'dist'])
    })

    it('should support exclude chaining', () => {
      const result = rule.exclude.add('node_modules').add('dist')
      expect(result).toBe(rule.exclude)
    })
  })

  describe('resource configuration', () => {
    it('should set resource regex', () => {
      rule.resource(/\.css$/)
      expect(rule.get('resource')).toEqual(/\.css$/)
    })

    it('should set resource string', () => {
      rule.resource('styles.css')
      expect(rule.get('resource')).toBe('styles.css')
    })
  })

  describe('resourceQuery configuration', () => {
    it('should set resourceQuery regex', () => {
      rule.resourceQuery(/\?inline/)
      expect(rule.get('resourceQuery')).toEqual(/\?inline/)
    })

    it('should set resourceQuery string', () => {
      rule.resourceQuery('?inline')
      expect(rule.get('resourceQuery')).toBe('?inline')
    })
  })

  describe('issuer configuration', () => {
    it('should set issuer regex', () => {
      rule.issuer(/\.vue$/)
      expect(rule.get('issuer')).toEqual(/\.vue$/)
    })

    it('should set issuer string', () => {
      rule.issuer('component.vue')
      expect(rule.get('issuer')).toBe('component.vue')
    })
  })

  describe('use configuration', () => {
    it('should add use loaders', () => {
      rule.use('babel').loader('babel-loader')
      rule.use('typescript').loader('ts-loader')
      
      const uses = rule.uses.entries()
      expect(uses).toHaveProperty('babel')
      expect(uses).toHaveProperty('typescript')
      expect(uses.babel).toBeInstanceOf(Use)
      expect(uses.typescript).toBeInstanceOf(Use)
    })

    it('should configure use with options', () => {
      rule.use('babel')
        .loader('babel-loader')
        .options({ presets: ['@babel/preset-env'] })
      
      const babelUse = rule.uses.get('babel')
      expect(babelUse.get('loader')).toBe('babel-loader')
      expect(babelUse.get('options')).toEqual({ presets: ['@babel/preset-env'] })
    })

    it('should support use chaining back to rule', () => {
      const result = rule
        .use('babel')
        .loader('babel-loader')
        .end()
      
      expect(result).toBe(rule)
    })
  })

  describe('oneOf configuration', () => {
    it('should add oneOf rules', () => {
      rule.oneOf('css').test(/\.css$/)
      rule.oneOf('scss').test(/\.scss$/)
      
      const oneOfRules = rule.oneOfs.entries()
      expect(oneOfRules).toHaveProperty('css')
      expect(oneOfRules).toHaveProperty('scss')
      expect(oneOfRules.css).toBeInstanceOf(Rule)
      expect(oneOfRules.scss).toBeInstanceOf(Rule)
    })

    it('should configure oneOf rules', () => {
      rule.oneOf('css')
        .test(/\.css$/)
        .use('css-loader')
        .loader('css-loader')
      
      const cssRule = rule.oneOfs.get('css')
      expect(cssRule.get('test')).toEqual(/\.css$/)
      expect(cssRule.uses.has('css-loader')).toBe(true)
    })

    it('should support oneOf chaining back to rule', () => {
      const result = rule
        .oneOf('css')
        .test(/\.css$/)
        .end()
      
      expect(result).toBe(rule)
    })
  })

  describe('type configuration', () => {
    it('should set type', () => {
      rule.type('asset/resource')
      expect(rule.get('type')).toBe('asset/resource')
    })

    it('should support different asset types', () => {
      rule.type('asset/inline')
      expect(rule.get('type')).toBe('asset/inline')
      
      rule.type('asset/source')
      expect(rule.get('type')).toBe('asset/source')
      
      rule.type('asset')
      expect(rule.get('type')).toBe('asset')
    })
  })

  describe('parser configuration', () => {
    it('should set parser options', () => {
      rule.parser({ amd: false })
      expect(rule.get('parser')).toEqual({ amd: false })
    })

    it('should merge parser options', () => {
      rule.parser({ amd: false })
      rule.parser({ commonjs: false })
      expect(rule.get('parser')).toEqual({ amd: false, commonjs: false })
    })
  })

  describe('generator configuration', () => {
    it('should set generator options', () => {
      rule.generator({ filename: '[name].[hash][ext]' })
      expect(rule.get('generator')).toEqual({ filename: '[name].[hash][ext]' })
    })

    it('should merge generator options', () => {
      rule.generator({ filename: '[name].[hash][ext]' })
      rule.generator({ publicPath: '/assets/' })
      expect(rule.get('generator')).toEqual({
        filename: '[name].[hash][ext]',
        publicPath: '/assets/'
      })
    })
  })

  describe('sideEffects configuration', () => {
    it('should set sideEffects boolean', () => {
      rule.sideEffects(false)
      expect(rule.get('sideEffects')).toBe(false)
    })

    it('should set sideEffects array', () => {
      rule.sideEffects(['*.css', '*.scss'])
      expect(rule.get('sideEffects')).toEqual(['*.css', '*.scss'])
    })
  })

  describe('enforce configuration', () => {
    it('should set enforce pre', () => {
      rule.enforce('pre')
      expect(rule.get('enforce')).toBe('pre')
    })

    it('should set enforce post', () => {
      rule.enforce('post')
      expect(rule.get('enforce')).toBe('post')
    })
  })

  describe('toConfig method', () => {
    it('should generate webpack rule config', () => {
      rule
        .test(/\.js$/)
        .include.add('src').end()
        .exclude.add('node_modules').end()
        .use('babel')
        .loader('babel-loader')
        .options({ presets: ['@babel/preset-env'] })
      
      const config = rule.toConfig()
      
      expect(config.test).toEqual(/\.js$/)
      expect(config.include).toEqual(['src'])
      expect(config.exclude).toEqual(['node_modules'])
      expect(config.use).toHaveLength(1)
      expect(config.use[0].loader).toBe('babel-loader')
      expect(config.use[0].options).toEqual({ presets: ['@babel/preset-env'] })
    })

    it('should handle oneOf rules', () => {
      rule
        .oneOf('css')
        .test(/\.css$/)
        .use('css-loader')
        .loader('css-loader')
        .end()
        .end()
        .oneOf('scss')
        .test(/\.scss$/)
        .use('sass-loader')
        .loader('sass-loader')
      
      const config = rule.toConfig()
      
      expect(config.oneOf).toHaveLength(2)
      expect(config.oneOf[0].test).toEqual(/\.css$/)
      expect(config.oneOf[1].test).toEqual(/\.scss$/)
    })

    it('should handle empty rule', () => {
      const config = rule.toConfig()
      expect(typeof config).toBe('object')
    })
  })

  describe('ordering', () => {
    it('should set before order', () => {
      rule.before('other-rule')
      expect(rule.get('__before')).toBe('other-rule')
    })

    it('should set after order', () => {
      rule.after('other-rule')
      expect(rule.get('__after')).toBe('other-rule')
    })
  })

  describe('complex scenarios', () => {
    it('should handle complex rule configuration', () => {
      rule
        .test(/\.(js|jsx|ts|tsx)$/)
        .include.add('src').add('lib').end()
        .exclude.add('node_modules').add('dist').end()
        .enforce('pre')
        .use('eslint')
        .loader('eslint-loader')
        .options({ fix: true })
        .end()
        .use('babel')
        .loader('babel-loader')
        .options({
          presets: ['@babel/preset-env', '@babel/preset-react'],
          plugins: ['@babel/plugin-proposal-class-properties']
        })
        .end()
        .use('typescript')
        .loader('ts-loader')
        .options({ transpileOnly: true })
      
      const config = rule.toConfig()
      
      expect(config.test).toEqual(/\.(js|jsx|ts|tsx)$/)
      expect(config.include).toEqual(['src', 'lib'])
      expect(config.exclude).toEqual(['node_modules', 'dist'])
      expect(config.enforce).toBe('pre')
      expect(config.use).toHaveLength(3)
    })

    it('should handle asset rules', () => {
      rule
        .test(/\.(png|jpe?g|gif|svg)$/)
        .type('asset')
        .parser({ dataUrlCondition: { maxSize: 8192 } })
        .generator({
          filename: 'images/[name].[hash][ext]',
          publicPath: '/static/'
        })
      
      const config = rule.toConfig()
      
      expect(config.test).toEqual(/\.(png|jpe?g|gif|svg)$/)
      expect(config.type).toBe('asset')
      expect(config.parser).toEqual({ dataUrlCondition: { maxSize: 8192 } })
      expect(config.generator).toEqual({
        filename: 'images/[name].[hash][ext]',
        publicPath: '/static/'
      })
    })
  })

  describe('chaining', () => {
    it('should support comprehensive method chaining', () => {
      const result = rule
        .test(/\.js$/)
        .include.add('src').end()
        .exclude.add('node_modules').end()
        .use('babel')
        .loader('babel-loader')
        .end()
        .before('typescript-rule')
        .after('eslint-rule')
      
      expect(result).toBe(rule)
      expect(rule.get('test')).toEqual(/\.js$/)
      expect(rule.include.values()).toEqual(['src'])
      expect(rule.exclude.values()).toEqual(['node_modules'])
      expect(rule.uses.has('babel')).toBe(true)
      expect(rule.get('__before')).toBe('typescript-rule')
      expect(rule.get('__after')).toBe('eslint-rule')
    })
  })
})