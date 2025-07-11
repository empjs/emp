import { describe, it, expect, beforeEach } from 'bun:test'
import Orderable from '../src/Orderable'
import ChainedMap from '../src/ChainedMap'

// Create a test class that uses Orderable mixin
class TestOrderable extends Orderable(ChainedMap) {
  constructor(parent?: any) {
    super(parent)
  }
}

describe('Orderable', () => {
  let orderable: TestOrderable

  beforeEach(() => {
    orderable = new TestOrderable()
  })

  describe('basic operations', () => {
    it('should create an orderable instance', () => {
      expect(orderable).toBeInstanceOf(TestOrderable)
      expect(orderable).toBeInstanceOf(ChainedMap)
    })

    it('should have ordering methods', () => {
      expect(typeof orderable.before).toBe('function')
      expect(typeof orderable.after).toBe('function')
    })
  })

  describe('before method', () => {
    it('should set before order', () => {
      orderable.before('other-item')
      expect(orderable.get('__before')).toBe('other-item')
    })

    it('should return instance for chaining', () => {
      const result = orderable.before('other-item')
      expect(result).toBe(orderable)
    })

    it('should handle string names', () => {
      orderable.before('plugin-name')
      expect(orderable.get('__before')).toBe('plugin-name')
    })

    it('should handle array of names', () => {
      orderable.before(['plugin-a', 'plugin-b'])
      expect(orderable.get('__before')).toEqual(['plugin-a', 'plugin-b'])
    })

    it('should overwrite previous before setting', () => {
      orderable.before('first')
      orderable.before('second')
      expect(orderable.get('__before')).toBe('second')
    })
  })

  describe('after method', () => {
    it('should set after order', () => {
      orderable.after('other-item')
      expect(orderable.get('__after')).toBe('other-item')
    })

    it('should return instance for chaining', () => {
      const result = orderable.after('other-item')
      expect(result).toBe(orderable)
    })

    it('should handle string names', () => {
      orderable.after('plugin-name')
      expect(orderable.get('__after')).toBe('plugin-name')
    })

    it('should handle array of names', () => {
      orderable.after(['plugin-a', 'plugin-b'])
      expect(orderable.get('__after')).toEqual(['plugin-a', 'plugin-b'])
    })

    it('should overwrite previous after setting', () => {
      orderable.after('first')
      orderable.after('second')
      expect(orderable.get('__after')).toBe('second')
    })
  })

  describe('combined ordering', () => {
    it('should support both before and after', () => {
      orderable
        .before('plugin-a')
        .after('plugin-b')
      
      expect(orderable.get('__before')).toBe('plugin-a')
      expect(orderable.get('__after')).toBe('plugin-b')
    })

    it('should support chaining with other methods', () => {
      orderable
        .set('config', 'value')
        .before('plugin-a')
        .set('option', 'test')
        .after('plugin-b')
      
      expect(orderable.get('config')).toBe('value')
      expect(orderable.get('option')).toBe('test')
      expect(orderable.get('__before')).toBe('plugin-a')
      expect(orderable.get('__after')).toBe('plugin-b')
    })
  })

  describe('ordering with different types', () => {
    it('should handle undefined values', () => {
      orderable.before(undefined as any)
      orderable.after(undefined as any)
      
      expect(orderable.get('__before')).toBeUndefined()
      expect(orderable.get('__after')).toBeUndefined()
    })

    it('should handle null values', () => {
      orderable.before(null as any)
      orderable.after(null as any)
      
      expect(orderable.get('__before')).toBeNull()
      expect(orderable.get('__after')).toBeNull()
    })

    it('should handle empty string', () => {
      orderable.before('')
      orderable.after('')
      
      expect(orderable.get('__before')).toBe('')
      expect(orderable.get('__after')).toBe('')
    })

    it('should handle numeric values', () => {
      orderable.before(123 as any)
      orderable.after(456 as any)
      
      expect(orderable.get('__before')).toBe(123)
      expect(orderable.get('__after')).toBe(456)
    })
  })

  describe('inheritance behavior', () => {
    it('should inherit ChainedMap methods', () => {
      expect(typeof orderable.set).toBe('function')
      expect(typeof orderable.get).toBe('function')
      expect(typeof orderable.has).toBe('function')
      expect(typeof orderable.delete).toBe('function')
      expect(typeof orderable.clear).toBe('function')
    })

    it('should work with ChainedMap functionality', () => {
      orderable
        .set('key1', 'value1')
        .before('plugin-a')
        .set('key2', 'value2')
        .after('plugin-b')
      
      expect(orderable.get('key1')).toBe('value1')
      expect(orderable.get('key2')).toBe('value2')
      expect(orderable.get('__before')).toBe('plugin-a')
      expect(orderable.get('__after')).toBe('plugin-b')
      
      const entries = orderable.entries()
      expect(entries.key1).toBe('value1')
      expect(entries.key2).toBe('value2')
      expect(entries.__before).toBe('plugin-a')
      expect(entries.__after).toBe('plugin-b')
    })
  })

  describe('parent relationship', () => {
    it('should maintain parent reference', () => {
      const parent = { name: 'parent' }
      const child = new TestOrderable(parent)
      
      expect(child.end()).toBe(parent)
    })

    it('should support chaining back to parent', () => {
      const parent = { name: 'parent' }
      const child = new TestOrderable(parent)
      
      const result = child
        .before('plugin-a')
        .after('plugin-b')
        .end()
      
      expect(result).toBe(parent)
    })
  })

  describe('mixin functionality', () => {
    it('should create different orderable classes', () => {
      class AnotherOrderable extends Orderable(ChainedMap) {}
      
      const instance1 = new TestOrderable()
      const instance2 = new AnotherOrderable()
      
      instance1.before('a')
      instance2.before('b')
      
      expect(instance1.get('__before')).toBe('a')
      expect(instance2.get('__before')).toBe('b')
    })

    it('should not interfere between instances', () => {
      const instance1 = new TestOrderable()
      const instance2 = new TestOrderable()
      
      instance1.before('plugin-1').after('plugin-2')
      instance2.before('plugin-3').after('plugin-4')
      
      expect(instance1.get('__before')).toBe('plugin-1')
      expect(instance1.get('__after')).toBe('plugin-2')
      expect(instance2.get('__before')).toBe('plugin-3')
      expect(instance2.get('__after')).toBe('plugin-4')
    })
  })

  describe('edge cases', () => {
    it('should handle rapid order changes', () => {
      orderable
        .before('a')
        .before('b')
        .before('c')
        .after('x')
        .after('y')
        .after('z')
      
      expect(orderable.get('__before')).toBe('c')
      expect(orderable.get('__after')).toBe('z')
    })

    it('should handle complex array ordering', () => {
      orderable
        .before(['plugin-a', 'plugin-b', 'plugin-c'])
        .after(['plugin-x', 'plugin-y', 'plugin-z'])
      
      expect(orderable.get('__before')).toEqual(['plugin-a', 'plugin-b', 'plugin-c'])
      expect(orderable.get('__after')).toEqual(['plugin-x', 'plugin-y', 'plugin-z'])
    })

    it('should handle mixed array and string ordering', () => {
      orderable.before(['plugin-a', 'plugin-b'])
      orderable.before('plugin-c')
      
      expect(orderable.get('__before')).toBe('plugin-c')
      
      orderable.after('plugin-x')
      orderable.after(['plugin-y', 'plugin-z'])
      
      expect(orderable.get('__after')).toEqual(['plugin-y', 'plugin-z'])
    })
  })

  describe('integration with other features', () => {
    it('should work with when method', () => {
      let executed = false
      
      orderable.when(true, (instance) => {
        executed = true
        instance.before('conditional-plugin')
      })
      
      expect(executed).toBe(true)
      expect(orderable.get('__before')).toBe('conditional-plugin')
    })

    it('should work with merge functionality', () => {
      orderable.before('original')
      
      orderable.merge({
        __before: 'merged',
        __after: 'also-merged',
        config: 'value'
      })
      
      expect(orderable.get('__before')).toBe('merged')
      expect(orderable.get('__after')).toBe('also-merged')
      expect(orderable.get('config')).toBe('value')
    })
  })
})