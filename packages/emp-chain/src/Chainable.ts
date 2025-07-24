export default class Chainable {
  parent: any

  constructor(parent: any) {
    this.parent = parent
  }

  batch(handler: (instance: this) => void): this {
    handler(this)
    return this
  }

  end(): any {
    return this.parent
  }
}
