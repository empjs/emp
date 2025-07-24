import ChainedSet from './ChainedSet'
import Resolve from './Resolve'

export default class ResolveLoader extends Resolve {
  moduleExtensions: ChainedSet
  packageMains: ChainedSet

  constructor(parent: any) {
    super(parent)
    this.moduleExtensions = new ChainedSet(this)
    this.packageMains = new ChainedSet(this)
  }

  override toConfig(): any {
    return this.clean({
      moduleExtensions: this.moduleExtensions.values(),
      packageMains: this.packageMains.values(),
      ...super.toConfig(),
    })
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
