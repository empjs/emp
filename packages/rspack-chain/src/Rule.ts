import ChainedMap from './ChainedMap'
import ChainedSet from './ChainedSet'
import Orderable from './Orderable'
import Resolve from './Resolve'
import Use from './Use'

function toArray<T>(arr: T | T[]): T[] {
  return Array.isArray(arr) ? arr : [arr]
}

interface RuleConfig {
  include?: any[]
  exclude?: any[]
  rules?: any[]
  oneOf?: any[]
  use?: any[]
  resolve?: any
  enforce?: string
  issuer?: any
  parser?: any
  generator?: any
  resource?: any
  resourceQuery?: any
  sideEffects?: boolean
  test?: RegExp | string | Function
  type?: string
  __ruleNames?: string[]
  __ruleTypes?: string[]
  [key: string]: any
}

class RuleBase<P = any> extends ChainedMap<any, P> {
  name: string
  names: string[]
  ruleType: string
  ruleTypes: string[]
  uses: ChainedMap<any, this>
  include: ChainedSet<any, this>
  exclude: ChainedSet<any, this>
  rules: ChainedMap<any, this>
  oneOfs: ChainedMap<any, this>
  resolve: Resolve<this>

  constructor(parent: P, name: string, ruleType = 'rule') {
    super(parent)
    this.name = name
    this.names = []
    this.ruleType = ruleType
    this.ruleTypes = []

    let rule: any = this
    while (rule instanceof RuleBase) {
      this.names.unshift(rule.name)
      this.ruleTypes.unshift(rule.ruleType)
      rule = rule.parent
    }

    this.uses = new ChainedMap(this)
    this.include = new ChainedSet(this)
    this.exclude = new ChainedSet(this)
    this.rules = new ChainedMap(this)
    this.oneOfs = new ChainedMap(this)
    this.resolve = new Resolve(this)
    this.extend([
      'enforce',
      'issuer',
      'parser',
      'generator',
      'resource',
      'resourceQuery',
      'sideEffects',
      'test',
      'type',
    ])
  }

  use(name: string) {
    return this.uses.getOrCompute(name, () => new Use(this, name))
  }

  rule(name: string) {
    return this.rules.getOrCompute(name, () => new Rule(this, name, 'rule'))
  }

  oneOf(name: string) {
    return this.oneOfs.getOrCompute(name, () => new Rule(this, name, 'oneOf'))
  }

  pre(): this {
    return this.set('enforce', 'pre')
  }

  post(): this {
    return this.set('enforce', 'post')
  }

  enforce(value: string): this {
    return this.set('enforce', value)
  }

  issuer(value: any): this {
    return this.set('issuer', value)
  }

  parser(value: any): this {
    const existing = this.get('parser') || {}
    return this.set('parser', {...existing, ...value})
  }

  generator(value: any): this {
    const existing = this.get('generator') || {}
    return this.set('generator', {...existing, ...value})
  }

  resource(value: any): this {
    return this.set('resource', value)
  }

  resourceQuery(value: any): this {
    return this.set('resourceQuery', value)
  }

  sideEffects(value: boolean): this {
    return this.set('sideEffects', value)
  }

  test(value: RegExp | string | Function): this {
    return this.set('test', value)
  }

  type(value: string): this {
    return this.set('type', value)
  }

  toConfig(): RuleConfig {
    const config = this.clean(
      Object.assign(this.entries() || {}, {
        include: this.include.values(),
        exclude: this.exclude.values(),
        rules: this.rules.values().map(rule => rule.toConfig()),
        oneOf: this.oneOfs.values().map(oneOf => oneOf.toConfig()),
        use: this.uses.values().map(use => use.toConfig()),
        resolve: this.resolve.toConfig(),
      }),
    ) as RuleConfig

    Object.defineProperties(config, {
      __ruleNames: {value: this.names},
      __ruleTypes: {value: this.ruleTypes},
    })

    return config
  }

  override merge(obj: any, omit: string[] = []): this {
    if (!omit.includes('include') && 'include' in obj) {
      this.include.merge(toArray(obj.include))
    }

    if (!omit.includes('exclude') && 'exclude' in obj) {
      this.exclude.merge(toArray(obj.exclude))
    }

    if (!omit.includes('use') && 'use' in obj) {
      Object.keys(obj.use).forEach(name => this.use(name).merge(obj.use[name]))
    }

    if (!omit.includes('rules') && 'rules' in obj) {
      Object.keys(obj.rules).forEach(name => this.rule(name).merge(obj.rules[name]))
    }

    if (!omit.includes('oneOf') && 'oneOf' in obj) {
      Object.keys(obj.oneOf).forEach(name => this.oneOf(name).merge(obj.oneOf[name]))
    }

    if (!omit.includes('resolve') && 'resolve' in obj) {
      this.resolve.merge(obj.resolve)
    }

    if (!omit.includes('test') && 'test' in obj) {
      this.test(obj.test instanceof RegExp || typeof obj.test === 'function' ? obj.test : new RegExp(obj.test))
    }

    return super.merge(obj, [...omit, 'include', 'exclude', 'use', 'rules', 'oneOf', 'resolve', 'test'])
  }
}

const Rule = Orderable(RuleBase)
export default Rule
