import merge from 'deepmerge'
import Chainable from './Chainable'

export default class ChainedMap extends Chainable {
  store: Map<string, any>
  shorthands?: string[]

  constructor(parent: any) {
    super(parent)
    this.store = new Map()
  }

  extend(methods: string[]): this {
    this.shorthands = methods
    methods.forEach(method => {
      ;(this as any)[method] = (value: any) => this.set(method, value)
    })
    return this
  }

  clear(): this {
    this.store.clear()
    return this
  }

  delete(key: string): this {
    this.store.delete(key)
    return this
  }

  order(): {entries: Record<string, any>; order: string[]} {
    const entries = [...this.store].reduce(
      (acc, [key, value]) => {
        acc[key] = value
        return acc
      },
      {} as Record<string, any>,
    )
    const names = Object.keys(entries)
    const order = [...names]

    names.forEach(name => {
      if (!entries[name]) {
        return
      }

      const {__before, __after} = entries[name]

      if (__before && order.includes(__before)) {
        order.splice(order.indexOf(name), 1)
        order.splice(order.indexOf(__before), 0, name)
      } else if (__after && order.includes(__after)) {
        order.splice(order.indexOf(name), 1)
        order.splice(order.indexOf(__after) + 1, 0, name)
      }
    })

    return {entries, order}
  }

  entries(): Record<string, any> | undefined {
    const {entries, order} = this.order()

    if (order.length) {
      return entries
    }

    return undefined
  }

  values(): any[] {
    const {entries, order} = this.order()

    return order.map(name => entries[name])
  }

  get(key: string): any {
    return this.store.get(key)
  }

  getOrCompute(key: string, fn: () => any): any {
    if (!this.has(key)) {
      this.set(key, fn())
    }
    return this.get(key)
  }

  has(key: string): boolean {
    return this.store.has(key)
  }

  set(key: string, value: any): this {
    this.store.set(key, value)
    return this
  }

  merge(obj: Record<string, any>, omit: string[] = []): this {
    Object.keys(obj).forEach(key => {
      if (omit.includes(key)) {
        return
      }

      const value = obj[key]

      if ((!Array.isArray(value) && typeof value !== 'object') || value === null || !this.has(key)) {
        this.set(key, value)
      } else {
        this.set(key, merge(this.get(key), value))
      }
    })

    return this
  }

  clean(obj: Record<string, any>): Record<string, any> {
    return Object.keys(obj).reduce(
      (acc, key) => {
        const value = obj[key]

        if (value === undefined) {
          return acc
        }

        if (Array.isArray(value) && !value.length) {
          return acc
        }

        if (Object.prototype.toString.call(value) === '[object Object]' && !Object.keys(value).length) {
          return acc
        }

        acc[key] = value

        return acc
      },
      {} as Record<string, any>,
    )
  }

  when(
    condition: any,
    whenTruthy: (instance: this) => void = Function.prototype as any,
    whenFalsy: (instance: this) => void = Function.prototype as any,
  ): this {
    if (condition) {
      whenTruthy(this)
    } else {
      whenFalsy(this)
    }

    return this
  }
}
