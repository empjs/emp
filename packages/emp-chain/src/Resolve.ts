import ChainedMap from './ChainedMap'
import ChainedSet from './ChainedSet'
import Plugin from './Plugin'

export default class Resolve extends ChainedMap {
  alias: ChainedMap
  aliasFields: ChainedSet
  descriptionFiles: ChainedSet
  extensions: ChainedSet
  mainFields: ChainedSet
  mainFiles: ChainedSet
  modules: ChainedSet
  plugins: ChainedMap

  constructor(parent: any) {
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

  plugin(name: string): any {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name, 'resolve.plugin'))
  }

  toConfig(): any {
    return this.clean(
      Object.assign(this.entries() || {}, {
        alias: this.alias.entries(),
        aliasFields: this.aliasFields.values(),
        descriptionFiles: this.descriptionFiles.values(),
        extensions: this.extensions.values(),
        mainFields: this.mainFields.values(),
        mainFiles: this.mainFiles.values(),
        modules: this.modules.values(),
        plugins: this.plugins.values().map((plugin: any) => plugin.toConfig()),
      }),
    )
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
