import { describe, it, expect, beforeEach } from 'bun:test'
import Plugin from '../src/Plugin'

class MockPlugin {
  constructor(public options: any = {}) {}
}

class AnotherMockPlugin {
  constructor(public config: any = {}) {}
}

describe('Plugin', () => {
  let plugin: Plugin

  beforeEach(() => {
    plugin = new Plugin()
  })

  describe('basic operations', () => {
    it('should create a new Plugin instance', () => {
      expect(plugin).toBeInstanceOf(Plugin)
    })

    it('should be orderable', () => {
      expect(typeof plugin.before).toBe('function')
      expect(typeof plugin.after).toBe('function')
    })
  })

  describe('use method', () => {
    it('should set plugin constructor and arguments', () => {
      plugin.use(MockPlugin, [{ option1: 'value1' }])
      
      expect(plugin.get('plugin')).toBe(MockPlugin)
      expect(plugin.get('args')).toEqual([{ option1: 'value1' }])
    })

    it('should handle plugin without arguments', () => {
      plugin.use(MockPlugin)
      
      expect(plugin.get('plugin')).toBe(MockPlugin)
      expect(plugin.get('args')).toEqual([])
    })

    it('should handle multiple arguments', () => {
      plugin.use(MockPlugin, ['arg1', 'arg2', { option: 'value' }])
      
      expect(plugin.get('args')).toEqual(['arg1', 'arg2', { option: 'value' }])
    })

    it('should return plugin instance for chaining', () => {
      const result = plugin.use(MockPlugin)
      expect(result).toBe(plugin)
    })
  })

  describe('tap method', () => {
    it('should modify plugin arguments', () => {
      plugin.use(MockPlugin, [{ initial: 'value' }])
      
      plugin.tap((args) => {
        args[0].modified = true
        args.push('new-arg')
        return args
      })
      
      const args = plugin.get('args')
      expect(args[0]).toEqual({ initial: 'value', modified: true })
      expect(args[1]).toBe('new-arg')
    })

    it('should handle empty arguments', () => {
      plugin.use(MockPlugin)
      
      plugin.tap((args) => {
        args.push('added-arg')
        return args
      })
      
      expect(plugin.get('args')).toEqual(['added-arg'])
    })

    it('should return plugin instance for chaining', () => {
      plugin.use(MockPlugin)
      const result = plugin.tap((args) => args)
      expect(result).toBe(plugin)
    })

    it('should handle multiple taps', () => {
      plugin.use(MockPlugin, [{ count: 0 }])
      
      plugin
        .tap((args) => {
          args[0].count += 1
          return args
        })
        .tap((args) => {
          args[0].count *= 2
          return args
        })
      
      expect(plugin.get('args')[0].count).toBe(2)
    })
  })

  describe('init method', () => {
    it('should initialize plugin with constructor function', () => {
      plugin.use(MockPlugin, [{ option: 'value' }])
      
      const instance = plugin.init()
      
      expect(instance).toBeInstanceOf(MockPlugin)
      expect(instance.options).toEqual({ option: 'value' })
    })

    it('should handle plugin without arguments', () => {
      plugin.use(MockPlugin)
      
      const instance = plugin.init()
      
      expect(instance).toBeInstanceOf(MockPlugin)
      expect(instance.options).toEqual({})
    })

    it('should handle multiple arguments', () => {
      plugin.use(AnotherMockPlugin, [{ config: 'test' }])
      
      const instance = plugin.init()
      
      expect(instance).toBeInstanceOf(AnotherMockPlugin)
      expect(instance.config).toEqual({ config: 'test' })
    })

    it('should apply tap modifications before initialization', () => {
      plugin
        .use(MockPlugin, [{ original: true }])
        .tap((args) => {
          args[0].tapped = true
          return args
        })
      
      const instance = plugin.init()
      
      expect(instance.options).toEqual({ original: true, tapped: true })
    })
  })

  describe('toConfig method', () => {
    it('should return initialized plugin instance', () => {
      plugin.use(MockPlugin, [{ config: 'test' }])
      
      const config = plugin.toConfig()
      
      expect(config).toBeInstanceOf(MockPlugin)
      expect(config.options).toEqual({ config: 'test' })
    })

    it('should be equivalent to init method', () => {
      plugin.use(MockPlugin, [{ test: 'value' }])
      
      const initResult = plugin.init()
      const configResult = plugin.toConfig()
      
      expect(initResult).toBeInstanceOf(MockPlugin)
      expect(configResult).toBeInstanceOf(MockPlugin)
      expect(initResult.options).toEqual(configResult.options)
    })
  })

  describe('ordering', () => {
    it('should set before order', () => {
      plugin.before('other-plugin')
      
      expect(plugin.get('__before')).toBe('other-plugin')
    })

    it('should set after order', () => {
      plugin.after('other-plugin')
      
      expect(plugin.get('__after')).toBe('other-plugin')
    })

    it('should support chaining with ordering', () => {
      const result = plugin
        .use(MockPlugin)
        .before('plugin-a')
        .after('plugin-b')
      
      expect(result).toBe(plugin)
      expect(plugin.get('__before')).toBe('plugin-a')
      expect(plugin.get('__after')).toBe('plugin-b')
    })
  })

  describe('parent relationship', () => {
    it('should maintain parent reference', () => {
      const parent = { name: 'parent' }
      const childPlugin = new Plugin(parent)
      
      expect(childPlugin.end()).toBe(parent)
    })

    it('should support chaining back to parent', () => {
      const parent = { name: 'parent' }
      const childPlugin = new Plugin(parent)
      
      const result = childPlugin
        .use(MockPlugin)
        .end()
      
      expect(result).toBe(parent)
    })
  })

  describe('error handling', () => {
    it('should handle invalid plugin constructor', () => {
      plugin.use(null as any)
      
      expect(() => plugin.init()).toThrow()
    })

    it('should handle tap function that throws', () => {
      plugin.use(MockPlugin, [{}])
      
      expect(() => {
        plugin.tap(() => {
          throw new Error('Tap error')
        })
      }).toThrow('Tap error')
    })
  })

  describe('complex scenarios', () => {
    it('should handle plugin reconfiguration', () => {
      plugin.use(MockPlugin, [{ version: 1 }])
      
      let instance1 = plugin.init()
      expect(instance1.options.version).toBe(1)
      
      plugin.use(AnotherMockPlugin, [{ version: 2 }])
      
      let instance2 = plugin.init()
      expect(instance2).toBeInstanceOf(AnotherMockPlugin)
      expect(instance2.config.version).toBe(2)
    })

    it('should handle complex tap modifications', () => {
      plugin.use(MockPlugin, [{ features: [] }])
      
      plugin
        .tap((args) => {
          args[0].features.push('feature1')
          return args
        })
        .tap((args) => {
          args[0].features.push('feature2')
          args[0].enabled = true
          return args
        })
      
      const instance = plugin.init()
      expect(instance.options.features).toEqual(['feature1', 'feature2'])
      expect(instance.options.enabled).toBe(true)
    })

    it('should maintain state across multiple operations', () => {
      plugin
        .use(MockPlugin, [{ base: 'config' }])
        .before('html-webpack-plugin')
        .tap((args) => {
          args[0].enhanced = true
          return args
        })
        .after('clean-webpack-plugin')
      
      expect(plugin.get('plugin')).toBe(MockPlugin)
      expect(plugin.get('args')[0]).toEqual({ base: 'config', enhanced: true })
      expect(plugin.get('__before')).toBe('html-webpack-plugin')
      expect(plugin.get('__after')).toBe('clean-webpack-plugin')
    })
  })
})