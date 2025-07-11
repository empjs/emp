import ChainedSet from './ChainedSet'
import Resolve from './Resolve'

interface ResolveLoaderConfig {
  moduleExtensions?: string[]
  packageMains?: string[]
  [key: string]: any
}

export default class ResolveLoader<P = any> extends Resolve<P> {
  moduleExtensions: ChainedSet<string, this>
  packageMains: ChainedSet<string, this>

  constructor(parent: P) {
    super(parent)
    this.moduleExtensions = new ChainedSet(this)
    this.packageMains = new ChainedSet(this)
  }

  override toConfig(): ResolveLoaderConfig {
    return this.clean({
      moduleExtensions: this.moduleExtensions.values(),
      packageMains: this.packageMains.values(),
      ...super.toConfig(),
    }) as ResolveLoaderConfig
  }

  override merge(obj: any, omit: string[] = []): this {
    const omissions = ['moduleExtensions', 'packageMains']

    omissions.forEach(key => {
      if (!omit.includes(key) && key in obj) {
        ;(this as any)[key].merge(obj[key])
      }
    })

    return super.merge(obj, [...omit, ...omissions])
  }
}
