import merge from 'deepmerge'
import ChainedMap from './ChainedMap'
import Orderable from './Orderable'

interface UseConfig {
  loader?: string
  options?: any
  __useName?: string
  __ruleNames?: string[]
  __ruleTypes?: string[]
  [key: string]: any
}

interface UseParent {
  names?: string[]
  ruleTypes?: string[]
}

class UseBase<P extends UseParent = any> extends ChainedMap<any, P> {
  name: string

  constructor(parent: P, name: string) {
    super(parent)
    this.name = name
    this.extend(['loader', 'options'])
  }

  loader(value: string): this {
    return this.set('loader', value)
  }

  options(value: any): this {
    return this.set('options', value)
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

  toConfig(): UseConfig {
    const config = this.clean(this.entries() || {}) as UseConfig

    Object.defineProperties(config, {
      __useName: {value: this.name},
      __ruleNames: {value: this.parent && this.parent.names},
      __ruleTypes: {value: this.parent && this.parent.ruleTypes},
    })

    return config
  }
}

export default Orderable(UseBase)
