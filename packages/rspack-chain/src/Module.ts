import ChainedMap from './ChainedMap'
import Rule from './Rule'

interface ModuleConfig {
  defaultRules?: any[]
  rules?: any[]
  noParse?: any
  strictExportPresence?: boolean
  [key: string]: any
}

export default class Module<P = any> extends ChainedMap<any, P> {
  rules: ChainedMap<any, this>
  defaultRules: ChainedMap<any, this>

  constructor(parent: P) {
    super(parent)
    this.rules = new ChainedMap(this)
    this.defaultRules = new ChainedMap(this)
    this.extend(['noParse', 'strictExportPresence'])
  }

  defaultRule(name: string) {
    return this.defaultRules.getOrCompute(name, () => new Rule(this, name, 'defaultRule'))
  }

  rule(name: string) {
    return this.rules.getOrCompute(name, () => new Rule(this, name, 'rule'))
  }

  noParse(value: any): this {
    return this.set('noParse', value)
  }

  strictExportPresence(value: boolean): this {
    return this.set('strictExportPresence', value)
  }

  toConfig(): ModuleConfig {
    return this.clean(
      Object.assign(this.entries() || {}, {
        defaultRules: this.defaultRules.values().map(r => r.toConfig()),
        rules: this.rules.values().map(r => r.toConfig()),
      }),
    ) as ModuleConfig
  }

  override merge(obj: any, omit: string[] = []): this {
    if (!omit.includes('rule') && 'rule' in obj) {
      Object.keys(obj.rule).forEach(name => this.rule(name).merge(obj.rule[name]))
    }

    if (!omit.includes('defaultRule') && 'defaultRule' in obj) {
      Object.keys(obj.defaultRule).forEach(name => this.defaultRule(name).merge(obj.defaultRule[name]))
    }

    return super.merge(obj, ['rule', 'defaultRule'])
  }
}
