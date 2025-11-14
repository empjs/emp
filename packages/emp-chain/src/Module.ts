import ChainedMap from './ChainedMap'
import Rule from './Rule'

export default class Module extends ChainedMap {
  rules: ChainedMap
  defaultRules: ChainedMap

  constructor(parent: any) {
    super(parent)
    this.rules = new ChainedMap(this)
    this.defaultRules = new ChainedMap(this)
  }

  noParse(
    value:
      | RegExp
      | RegExp[]
      | ((resource: string) => boolean)
      | Array<(resource: string) => boolean>
      | string
      | Array<string | RegExp>,
  ): this {
    return this.set('noParse', value)
  }

  strictExportPresence(value: boolean): this {
    return this.set('strictExportPresence', value)
  }

  defaultRule(name: string): any {
    return this.defaultRules.getOrCompute(name, () => new Rule(this, name, 'defaultRule'))
  }

  rule(name: string): any {
    return this.rules.getOrCompute(name, () => new Rule(this, name, 'rule'))
  }

  toConfig(): any {
    return this.clean(
      Object.assign(this.entries() || {}, {
        defaultRules: this.defaultRules.values().map((r: any) => r.toConfig()),
        rules: this.rules.values().map((r: any) => r.toConfig()),
      }),
    )
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
