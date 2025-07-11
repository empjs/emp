import { describe, it, expect, beforeEach } from 'bun:test'
import ChainedSet from '../src/ChainedSet'

class TestChainedSet extends ChainedSet<string> {
  constructor(parent?: any) {
    super(parent)
  }
}

describe('ChainedSet', () => {
  let chainedSet: TestChainedSet

  beforeEach(() => {
    chainedSet = new TestChainedSet()
  })

  describe('basic operations', () => {
    it('should create a new ChainedSet instance', () => {
      expect(chainedSet).toBeInstanceOf(ChainedSet)
    })

    it('should add values', () => {
      chainedSet.add('value1')
      expect(chainedSet.has('value1')).toBe(true)
    })

    it('should check if value exists', () => {
      chainedSet.add('value1')
      expect(chainedSet.has('value1')).toBe(true)
      expect(chainedSet.has('value2')).toBe(false)
    })

    it('should delete values', () => {
      chainedSet.add('value1')
      chainedSet.delete('value1')
      expect(chainedSet.has('value1')).toBe(false)
    })

    it('should clear all values', () => {
      chainedSet.add('value1')
      chainedSet.add('value2')
      chainedSet.clear()
      expect(chainedSet.has('value1')).toBe(false)
      expect(chainedSet.has('value2')).toBe(false)
    })
  })

  describe('values method', () => {
    it('should return all values as array', () => {
      chainedSet.add('value1')
      chainedSet.add('value2')
      chainedSet.add('value3')
      
      const values = chainedSet.values()
      expect(values).toEqual(['value1', 'value2', 'value3'])
    })

    it('should return empty array when no values', () => {
      expect(chainedSet.values()).toEqual([])
    })

    it('should maintain insertion order', () => {
      chainedSet.add('third')
      chainedSet.add('first')
      chainedSet.add('second')
      
      expect(chainedSet.values()).toEqual(['third', 'first', 'second'])
    })
  })

  describe('prepend method', () => {
    it('should add value to the beginning', () => {
      chainedSet.add('second')
      chainedSet.add('third')
      chainedSet.prepend('first')
      
      expect(chainedSet.values()).toEqual(['first', 'second', 'third'])
    })

    it('should work with empty set', () => {
      chainedSet.prepend('first')
      expect(chainedSet.values()).toEqual(['first'])
    })

    it('should not duplicate existing values', () => {
      chainedSet.add('existing')
      chainedSet.add('other')
      chainedSet.prepend('existing')
      
      expect(chainedSet.values()).toEqual(['existing', 'other'])
    })
  })

  describe('merge method', () => {
    it('should merge array of values', () => {
      chainedSet.add('existing')
      chainedSet.merge(['new1', 'new2', 'existing'])
      
      const values = chainedSet.values()
      expect(values).toContain('existing')
      expect(values).toContain('new1')
      expect(values).toContain('new2')
      expect(values.length).toBe(3) // no duplicates
    })

    it('should handle empty array merge', () => {
      chainedSet.add('existing')
      chainedSet.merge([])
      
      expect(chainedSet.values()).toEqual(['existing'])
    })

    it('should merge with empty set', () => {
      chainedSet.merge(['value1', 'value2'])
      
      expect(chainedSet.values()).toEqual(['value1', 'value2'])
    })
  })

  describe('when method', () => {
    it('should execute callback when condition is true', () => {
      let executed = false
      chainedSet.when(true, (set) => {
        executed = true
        set.add('conditional')
      })
      
      expect(executed).toBe(true)
      expect(chainedSet.has('conditional')).toBe(true)
    })

    it('should not execute callback when condition is false', () => {
      let executed = false
      chainedSet.when(false, (set) => {
        executed = true
        set.add('conditional')
      })
      
      expect(executed).toBe(false)
      expect(chainedSet.has('conditional')).toBe(false)
    })

    it('should execute otherwise callback when condition is false', () => {
      let mainExecuted = false
      let otherwiseExecuted = false
      
      chainedSet.when(
        false,
        (set) => {
          mainExecuted = true
        },
        (set) => {
          otherwiseExecuted = true
          set.add('otherwise')
        }
      )
      
      expect(mainExecuted).toBe(false)
      expect(otherwiseExecuted).toBe(true)
      expect(chainedSet.has('otherwise')).toBe(true)
    })

    it('should return the chainedSet instance', () => {
      const result = chainedSet.when(true, (set) => {})
      expect(result).toBe(chainedSet)
    })
  })

  describe('chaining', () => {
    it('should support method chaining', () => {
      const result = chainedSet
        .add('value1')
        .add('value2')
        .delete('value1')
        .add('value3')
      
      expect(result).toBe(chainedSet)
      expect(chainedSet.has('value1')).toBe(false)
      expect(chainedSet.has('value2')).toBe(true)
      expect(chainedSet.has('value3')).toBe(true)
    })
  })

  describe('parent relationship', () => {
    it('should maintain parent reference', () => {
      const parent = { name: 'parent' }
      const child = new TestChainedSet(parent)
      
      expect(child.end()).toBe(parent)
    })

    it('should handle undefined parent', () => {
      const child = new TestChainedSet()
      expect(child.end()).toBeUndefined()
    })
  })

  describe('duplicate handling', () => {
    it('should not add duplicate values', () => {
      chainedSet.add('duplicate')
      chainedSet.add('duplicate')
      chainedSet.add('unique')
      
      expect(chainedSet.values()).toEqual(['duplicate', 'unique'])
    })

    it('should handle different types correctly', () => {
      const mixedSet = new ChainedSet<any>()
      mixedSet.add('string')
      mixedSet.add(123)
      mixedSet.add(true)
      mixedSet.add('string') // duplicate
      
      expect(mixedSet.values()).toEqual(['string', 123, true])
    })
  })

  describe('size and emptiness', () => {
    it('should track size correctly', () => {
      expect(chainedSet.values().length).toBe(0)
      
      chainedSet.add('value1')
      expect(chainedSet.values().length).toBe(1)
      
      chainedSet.add('value2')
      expect(chainedSet.values().length).toBe(2)
      
      chainedSet.delete('value1')
      expect(chainedSet.values().length).toBe(1)
      
      chainedSet.clear()
      expect(chainedSet.values().length).toBe(0)
    })
  })

  describe('edge cases', () => {
    it('should handle null and undefined values', () => {
      const mixedSet = new ChainedSet<any>()
      mixedSet.add(null)
      mixedSet.add(undefined)
      mixedSet.add('')
      mixedSet.add(0)
      mixedSet.add(false)
      
      expect(mixedSet.values()).toEqual([null, undefined, '', 0, false])
    })

    it('should handle object values', () => {
      const objSet = new ChainedSet<object>()
      const obj1 = { id: 1 }
      const obj2 = { id: 2 }
      
      objSet.add(obj1)
      objSet.add(obj2)
      objSet.add(obj1) // same reference
      
      expect(objSet.values()).toEqual([obj1, obj2])
    })
  })

  describe('batch operations', () => {
    it('should handle batch method if available', () => {
      const result = chainedSet.batch((set) => {
        set.add('batch1')
        set.add('batch2')
        set.add('batch3')
        return 'batch-result'
      })
      
      expect(result).toBe('batch-result')
      expect(chainedSet.values()).toEqual(['batch1', 'batch2', 'batch3'])
    })
  })
})