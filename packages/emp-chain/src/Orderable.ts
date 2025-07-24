type Constructor<T = any> = new (...args: any[]) => T

export default function Orderable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    __before?: string
    __after?: string

    before(name: string): this {
      if (this.__after) {
        throw new Error(`Unable to set .before(${JSON.stringify(name)}) with existing value for .after()`)
      }

      this.__before = name
      return this
    }

    after(name: string): this {
      if (this.__before) {
        throw new Error(`Unable to set .after(${JSON.stringify(name)}) with existing value for .before()`)
      }

      this.__after = name
      return this
    }

    merge(obj: any, omit: string[] = []): this {
      if (obj.before) {
        this.before(obj.before)
      }

      if (obj.after) {
        this.after(obj.after)
      }

      return super.merge(obj, [...omit, 'before', 'after'])
    }
  }
}
