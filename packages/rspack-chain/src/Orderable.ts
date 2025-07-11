interface OrderableClass {
  new (...args: any[]): any;
  prototype: any;
}

export interface OrderableMixin {
  __before?: string | string[];
  __after?: string | string[];
  before(name: string | string[]): this;
  after(name: string | string[]): this;
  merge(obj: any, omit?: string[]): this;
}

export default function Orderable<T extends OrderableClass>(
  Class: T
): T & (new (...args: any[]) => OrderableMixin) {
  return class extends Class implements OrderableMixin {
    __before?: string | string[];
    __after?: string | string[];

    before(name: string | string[]): this {
      // Remove the error throwing - allow both before and after to be set
      if (this.set) {
        this.set('__before', name);
      } else {
        this.__before = name;
      }
      return this;
    }

    after(name: string | string[]): this {
      // Remove the error throwing - allow both before and after to be set
      if (this.set) {
        this.set('__after', name);
      } else {
        this.__after = name;
      }
      return this;
    }

    merge(obj: any, omit: string[] = []): this {
      if (obj.__before) {
        this.before(obj.__before);
      }

      if (obj.__after) {
        this.after(obj.__after);
      }

      return super.merge(obj, [...omit, '__before', '__after']);
    }
  } as any;
}