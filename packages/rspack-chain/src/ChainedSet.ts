import Chainable from './Chainable';

export default class ChainedSet<T = any, P = any> extends Chainable<P> {
  store: Set<T>;

  constructor(parent: P) {
    super(parent);
    this.store = new Set();
  }

  add(value: T): this {
    this.store.add(value);
    return this;
  }

  prepend(value: T): this {
    this.store = new Set([value, ...this.store]);
    return this;
  }

  clear(): this {
    this.store.clear();
    return this;
  }

  delete(value: T): this {
    this.store.delete(value);
    return this;
  }

  values(): T[] {
    return [...this.store];
  }

  has(value: T): boolean {
    return this.store.has(value);
  }

  merge(arr: T[]): this {
    this.store = new Set([...this.store, ...arr]);
    return this;
  }

  when(
    condition: any,
    whenTruthy: (instance: this) => void = () => {},
    whenFalsy: (instance: this) => void = () => {}
  ): this {
    if (condition) {
      whenTruthy(this);
    } else {
      whenFalsy(this);
    }

    return this;
  }
}