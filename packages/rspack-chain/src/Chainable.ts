export default class Chainable<T = any> {
  parent: T;

  constructor(parent: T) {
    this.parent = parent;
  }

  batch<R>(handler: (instance: this) => R): R {
    return handler(this);
  }

  end(): T {
    return this.parent;
  }
}