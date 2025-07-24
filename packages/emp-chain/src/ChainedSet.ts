import Chainable from './Chainable'

export default class ChainedSet extends Chainable {
  store: Set<any>

  constructor(parent: any) {
    super(parent)
    this.store = new Set()
  }

  add(value: any): this {
    this.store.add(value)
    return this
  }

  prepend(value: any): this {
    this.store = new Set([value, ...this.store])
    return this
  }

  clear(): this {
    this.store.clear()
    return this
  }

  delete(value: any): this {
    this.store.delete(value)
    return this
  }

  values(): any[] {
    return [...this.store]
  }

  has(value: any): boolean {
    return this.store.has(value)
  }

  merge(arr: any[]): this {
    this.store = new Set([...this.store, ...arr])
    return this
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
