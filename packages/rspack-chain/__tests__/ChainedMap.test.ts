import { describe, it, expect, beforeEach } from 'bun:test'
import ChainedMap from '../src/ChainedMap'

class TestChainedMap extends ChainedMap<any> {
  constructor(parent?: any) {
    super(parent)
  }
}

describe('ChainedMap', () => {
  let chainedMap: TestChainedMap

  beforeEach(() => {
    chainedMap = new TestChainedMap()
  })

  describe('basic operations', () => {
    it('should create a new ChainedMap instance', () => {
      expect(chainedMap).toBeInstanceOf(ChainedMap)
    })

    it('should set and get values', () => {
      chainedMap.set('key1', 'value1')
      expect(chainedMap.get('key1')).toBe('value1')
    })

    it('should check if key exists', () => {
      chainedMap.set('key1', 'value1')
      expect(chainedMap.has('key1')).toBe(true)
      expect(chainedMap.has('key2')).toBe(false)
    })

    it('should delete keys', () => {
      chainedMap.set('key1', 'value1')
      chainedMap.delete('key1')
      expect(chainedMap.has('key1')).toBe(false)
    })

    it('should clear all values', () => {
      chainedMap.set('key1', 'value1')
      chainedMap.set('key2', 'value2')
      chainedMap.clear()
      expect(chainedMap.has('key1')).toBe(false)
      expect(chainedMap.has('key2')).toBe(false)
    })
  })

  describe('entries and values', () => {
    it('should return all entries', () => {
      chainedMap.set('key1', 'value1')
      chainedMap.set('key2', 'value2')
      
      const entries = chainedMap.entries()
      expect(entries).toEqual({
        key1: 'value1',
        key2: 'value2'
      })
    })

    it('should return all values', () => {
      chainedMap.set('key1', 'value1')
      chainedMap.set('key2', 'value2')
      
      const values = chainedMap.values()
      expect(values).toEqual(['value1', 'value2'])
    })

    it('should return empty object for entries when empty', () => {
      expect(chainedMap.entries()).toEqual({})
    })

    it('should return empty array for values when empty', () => {
      expect(chainedMap.values()).toEqual([])
    })
  })

  describe('getOrCompute', () => {
    it('should get existing value', () => {
      chainedMap.set('key1', 'existing')
      const value = chainedMap.getOrCompute('key1', () => 'computed')
      expect(value).toBe('existing')
    })

    it('should compute and set new value', () => {
      const value = chainedMap.getOrCompute('key1', () => 'computed')
      expect(value).toBe('computed')
      expect(chainedMap.get('key1')).toBe('computed')
    })

    it('should handle function that returns undefined', () => {
      const value = chainedMap.getOrCompute('key1', () => undefined)
      expect(value).toBeUndefined()
      expect(chainedMap.has('key1')).toBe(true)
    })
  })

  describe('merge', () => {
    it('should merge object into chainedMap', () => {
      chainedMap.set('key1', 'original')
      chainedMap.merge({
        key1: 'updated',
        key2: 'new'
      })
      
      expect(chainedMap.get('key1')).toBe('updated')
      expect(chainedMap.get('key2')).toBe('new')
    })

    it('should handle empty merge object', () => {
      chainedMap.set('key1', 'value1')
      chainedMap.merge({})
      
      expect(chainedMap.get('key1')).toBe('value1')
    })

    it('should merge nested objects', () => {
      chainedMap.set('nested', { a: 1, b: 2 })
      chainedMap.merge({
        nested: { b: 3, c: 4 }
      })
      
      expect(chainedMap.get('nested')).toEqual({ a: 1, b: 3, c: 4 })
    })
  })

  describe('when method', () => {
    it('should execute callback when condition is true', () => {
      let executed = false
      chainedMap.when(true, (map) => {
        executed = true
        map.set('key1', 'value1')
      })
      
      expect(executed).toBe(true)
      expect(chainedMap.get('key1')).toBe('value1')
    })

    it('should not execute callback when condition is false', () => {
      let executed = false
      chainedMap.when(false, (map) => {
        executed = true
        map.set('key1', 'value1')
      })
      
      expect(executed).toBe(false)
      expect(chainedMap.has('key1')).toBe(false)
    })

    it('should execute otherwise callback when condition is false', () => {
      let mainExecuted = false
      let otherwiseExecuted = false
      
      chainedMap.when(
        false,
        (map) => {
          mainExecuted = true
        },
        (map) => {
          otherwiseExecuted = true
          map.set('key1', 'otherwise')
        }
      )
      
      expect(mainExecuted).toBe(false)
      expect(otherwiseExecuted).toBe(true)
      expect(chainedMap.get('key1')).toBe('otherwise')
    })

    it('should return the chainedMap instance', () => {
      const result = chainedMap.when(true, (map) => {})
      expect(result).toBe(chainedMap)
    })
  })

  describe('chaining', () => {
    it('should support method chaining', () => {
      const result = chainedMap
        .set('key1', 'value1')
        .set('key2', 'value2')
        .delete('key1')
      
      expect(result).toBe(chainedMap)
      expect(chainedMap.has('key1')).toBe(false)
      expect(chainedMap.get('key2')).toBe('value2')
    })
  })

  describe('parent relationship', () => {
    it('should maintain parent reference', () => {
      const parent = { name: 'parent' }
      const child = new TestChainedMap(parent)
      
      expect(child.end()).toBe(parent)
    })

    it('should handle undefined parent', () => {
      const child = new TestChainedMap()
      expect(child.end()).toBeUndefined()
    })
  })

  describe('extend method', () => {
    it('should extend with shorthand methods', () => {
      const extended = chainedMap.extend(['foo', 'bar'])
      
      expect(typeof (extended as any).foo).toBe('function')
      expect(typeof (extended as any).bar).toBe('function')
    })

    it('should create shorthand methods that set values', () => {
      const extended = chainedMap.extend(['mode', 'target']) as any
      
      extended.mode('development')
      extended.target('web')
      
      expect(chainedMap.get('mode')).toBe('development')
      expect(chainedMap.get('target')).toBe('web')
    })

    it('should return chainedMap from shorthand methods', () => {
      const extended = chainedMap.extend(['mode']) as any
      const result = extended.mode('development')
      
      expect(result).toBe(chainedMap)
    })
  })

  describe('clean method', () => {
    it('should remove undefined values', () => {
      chainedMap.set('defined', 'value')
      chainedMap.set('undefined', undefined)
      chainedMap.set('null', null)
      chainedMap.set('empty', '')
      chainedMap.set('zero', 0)
      chainedMap.set('false', false)
      
      const cleaned = chainedMap.clean(chainedMap.entries())
      
      expect(cleaned).toEqual({
        defined: 'value',
        null: null,
        empty: '',
        zero: 0,
        false: false
      })
    })

    it('should handle nested objects', () => {
      const obj = {
        level1: {
          defined: 'value',
          undefined: undefined,
          level2: {
            nested: 'value',
            undefined: undefined
          }
        }
      }
      
      const cleaned = chainedMap.clean(obj)
      
      expect(cleaned).toEqual({
        level1: {
          defined: 'value',
          level2: {
            nested: 'value'
          }
        }
      })
    })
  })
})