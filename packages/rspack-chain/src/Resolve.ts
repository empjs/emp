import ChainedMap from './ChainedMap'
import ChainedSet from './ChainedSet'
import Plugin from './Plugin'

interface ResolveConfig {
  alias?: Record<string, any>
  aliasFields?: string[]
  descriptionFiles?: string[]
  extensions?: string[]
  mainFields?: string[]
  mainFiles?: string[]
  modules?: string[]
  plugins?: any[]
  cachePredicate?: any
  cacheWithContext?: any
  concord?: any
  enforceExtension?: boolean
  enforceModuleExtension?: boolean
  symlinks?: boolean
  unsafeCache?: any
  [key: string]: any
}

export default class Resolve<P = any> extends ChainedMap<any, P> {
  alias: ChainedMap<any, this>
  aliasFields: ChainedSet<string, this>
  descriptionFiles: ChainedSet<string, this>
  extensions: ChainedSet<string, this>
  mainFields: ChainedSet<string, this>
  mainFiles: ChainedSet<string, this>
  modules: ChainedSet<string, this>
  plugins: ChainedMap<any, this>

  constructor(parent: P) {
    super(parent)
    this.alias = new ChainedMap(this)
    this.aliasFields = new ChainedSet(this)
    this.descriptionFiles = new ChainedSet(this)
    this.extensions = new ChainedSet(this)
    this.mainFields = new ChainedSet(this)
    this.mainFiles = new ChainedSet(this)
    this.modules = new ChainedSet(this)
    this.plugins = new ChainedMap(this)
    this.extend([
      'cachePredicate',
      'cacheWithContext',
      'concord',
      'enforceExtension',
      'enforceModuleExtension',
      'symlinks',
      'unsafeCache',
    ])
  }

  plugin(name: string) {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name, 'resolve.plugin'))
  }

  toConfig(): ResolveConfig {
    return this.clean(
      Object.assign(this.entries() || {}, {
        alias: this.alias.entries(),
        aliasFields: this.aliasFields.values(),
        descriptionFiles: this.descriptionFiles.values(),
        extensions: this.extensions.values(),
        mainFields: this.mainFields.values(),
        mainFiles: this.mainFiles.values(),
        modules: this.modules.values(),
        plugins: this.plugins.values().map(plugin => plugin.toConfig()),
      }),
    ) as ResolveConfig
  }

  override merge(obj: any, omit: string[] = []): this {
    const omissions = ['alias', 'aliasFields', 'descriptionFiles', 'extensions', 'mainFields', 'mainFiles', 'modules']

    if (!omit.includes('plugin') && 'plugin' in obj) {
      Object.keys(obj.plugin).forEach(name => this.plugin(name).merge(obj.plugin[name]))
    }

    omissions.forEach(key => {
      if (!omit.includes(key) && key in obj) {
        ;(this as any)[key].merge(obj[key])
      }
    })

    return super.merge(obj, [...omit, ...omissions, 'plugin'])
  }
}
