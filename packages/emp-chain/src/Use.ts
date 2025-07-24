import merge from 'deepmerge'
import ChainedMap from './ChainedMap'
import Orderable from './Orderable'

class UseBase extends ChainedMap {
  name: string
  options: any
  loader: any

  constructor(parent: any, name: string) {
    super(parent)
    this.name = name
    this.extend(['loader', 'options'])
  }

  tap(f: (options: any) => any): this {
    this.options(f(this.get('options')))
    return this
  }

  override merge(obj: any, omit: string[] = []): this {
    if (!omit.includes('loader') && 'loader' in obj) {
      this.loader(obj.loader)
    }

    if (!omit.includes('options') && 'options' in obj) {
      this.options(merge(this.store.get('options') || {}, obj.options))
    }

    return super.merge(obj, [...omit, 'loader', 'options'])
  }

  toConfig(): any {
    const config = this.clean(this.entries() || {})

    Object.defineProperties(config, {
      __useName: {value: this.name},
      __ruleNames: {value: (this.parent as any)?.names},
      __ruleTypes: {value: (this.parent as any)?.ruleTypes},
    })

    return config
  }
}

export default Orderable(UseBase)
