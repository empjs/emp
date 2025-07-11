import merge from 'deepmerge';
import Chainable from './Chainable';

interface OrderableItem {
  __before?: string;
  __after?: string;
  [key: string]: any;
}

interface OrderResult<T> {
  entries: Record<string, T>;
  order: string[];
}

export default class ChainedMap<T = any, P = any> extends Chainable<P> {
  store: Map<string, T>;
  shorthands?: string[];

  constructor(parent: P) {
    super(parent);
    this.store = new Map();
  }

  extend(methods: string[]): this {
    this.shorthands = methods;
    methods.forEach((method) => {
      (this as any)[method] = (value: T) => this.set(method, value);
    });
    return this;
  }

  clear(): this {
    this.store.clear();
    return this;
  }

  delete(key: string): this {
    this.store.delete(key);
    return this;
  }

  order(): OrderResult<T> {
    const entries = [...this.store].reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, T>);
    const names = Object.keys(entries);
    const order = [...names];

    names.forEach((name) => {
      if (!entries[name]) {
        return;
      }

      const { __before, __after } = entries[name] as OrderableItem;

      if (__before && order.includes(__before)) {
        order.splice(order.indexOf(name), 1);
        order.splice(order.indexOf(__before), 0, name);
      } else if (__after && order.includes(__after)) {
        order.splice(order.indexOf(name), 1);
        order.splice(order.indexOf(__after) + 1, 0, name);
      }
    });

    return { entries, order };
  }

  entries(): Record<string, T> {
    const { entries, order } = this.order();

    if (order.length) {
      return entries;
    }

    return {}; // 返回空对象而不是 undefined
  }

  values(): T[] {
    const { entries, order } = this.order();

    return order.map((name) => entries[name]);
  }

  get(key: string): T | undefined {
    return this.store.get(key);
  }

  getOrCompute(key: string, fn: () => T): T {
    if (!this.has(key)) {
      this.set(key, fn());
    }
    return this.get(key)!;
  }

  has(key: string): boolean {
    return this.store.has(key);
  }

  set(key: string, value: T): this {
    this.store.set(key, value);
    return this;
  }

  merge(obj: Record<string, any>, omit: string[] = []): this {
    Object.keys(obj).forEach((key) => {
      if (omit.includes(key)) {
        return;
      }

      const value = obj[key];

      if (
        (!Array.isArray(value) && typeof value !== 'object') ||
        value === null ||
        !this.has(key)
      ) {
        this.set(key, value);
      } else {
        this.set(key, merge(this.get(key) as any, value));
      }
    });

    return this;
  }

  clean(obj: Record<string, any>): Record<string, any> {
    return Object.keys(obj).reduce((acc, key) => {
      const value = obj[key];

      if (value === undefined) {
        return acc;
      }

      if (Array.isArray(value) && !value.length) {
        return acc;
      }

      if (
        Object.prototype.toString.call(value) === '[object Object]' &&
        !Object.keys(value).length
      ) {
        return acc;
      }

      acc[key] = value;

      return acc;
    }, {} as Record<string, any>);
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