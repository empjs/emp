import ChainedMap from './ChainedMap'
import ChainedSet from './ChainedSet'
import DevServer from './DevServer'
import Module from './Module'
import Optimization from './Optimization'
import Output from './Output'
import Performance from './Performance'
import Plugin from './Plugin'
import Resolve from './Resolve'
import ResolveLoader from './ResolveLoader'

interface ConfigToStringOptions {
  verbose?: boolean
  configPrefix?: string
}

interface WebpackConfig {
  node?: any
  output?: any
  resolve?: any
  resolveLoader?: any
  devServer?: any
  module?: any
  optimization?: any
  plugins?: any[]
  performance?: any
  entry?: Record<string, any>
  amd?: any
  bail?: boolean
  cache?: any
  context?: string
  devtool?: string | false
  externals?: any
  loader?: any
  mode?: string
  name?: string
  parallelism?: number
  profile?: boolean
  recordsInputPath?: string
  recordsPath?: string
  recordsOutputPath?: string
  stats?: any
  target?: string | string[]
  watch?: boolean
  watchOptions?: any
  [key: string]: any
}

export default class Config extends ChainedMap<any, undefined> {
  devServer: DevServer<this>
  entryPoints: ChainedMap<ChainedSet<any, this>, this>
  module: Module<this>
  node: ChainedMap<any, this>
  optimization: Optimization<this>
  output: Output<this>
  performance: Performance<this>
  plugins: ChainedMap<any, this>
  resolve: Resolve<this>
  resolveLoader: ResolveLoader<this>

  constructor() {
    super(undefined as any)
    this.devServer = new DevServer(this)
    this.entryPoints = new ChainedMap(this)
    this.module = new Module(this)
    this.node = new ChainedMap(this)
    this.optimization = new Optimization(this)
    this.output = new Output(this)
    this.performance = new Performance(this)
    this.plugins = new ChainedMap(this)
    this.resolve = new Resolve(this)
    this.resolveLoader = new ResolveLoader(this)
    this.extend([
      'amd',
      'bail',
      'cache',
      'context',
      'devtool',
      'externals',
      'loader',
      'mode',
      'name',
      'parallelism',
      'profile',
      'recordsInputPath',
      'recordsPath',
      'recordsOutputPath',
      'stats',
      'target',
      'watch',
      'watchOptions',
    ])
  }

  static override toString(
    config: WebpackConfig,
    {verbose = false, configPrefix = 'config'}: ConfigToStringOptions = {},
  ): string {
    // eslint-disable-next-line global-require
    const {stringify} = require('javascript-stringify')

    return stringify(
      config,
      (value: any, indent: number, stringify: any) => {
        // improve plugin output
        if (value && value.__pluginName) {
          const prefix = `/* ${configPrefix}.${value.__pluginType}('${value.__pluginName}') */\n`
          const constructorExpression = value.__pluginPath
            ? // The path is stringified to ensure special characters are escaped
              // (such as the backslashes in Windows-style paths).
              `(require(${stringify(value.__pluginPath)}))`
            : value.__pluginConstructorName

          if (constructorExpression) {
            // get correct indentation for args by stringifying the args array and
            // discarding the square brackets.
            const args = stringify(value.__pluginArgs).slice(1, -1)
            return `${prefix}new ${constructorExpression}(${args})`
          }
          return prefix + stringify(value.__pluginArgs && value.__pluginArgs.length ? {args: value.__pluginArgs} : {})
        }

        // improve rule/use output
        if (value && value.__ruleNames) {
          const ruleTypes = value.__ruleTypes
          const prefix = `/* ${configPrefix}.module${value.__ruleNames
            .map((r: string, index: number) => `.${ruleTypes ? ruleTypes[index] : 'rule'}('${r}')`)
            .join('')}${value.__useName ? `.use('${value.__useName}')` : ``} */\n`
          return prefix + stringify(value)
        }

        if (value && value.__expression) {
          return value.__expression
        }

        // shorten long functions
        if (typeof value === 'function') {
          if (!verbose && value.toString().length > 100) {
            return `function () { /* omitted long function */ }`
          }
        }

        return stringify(value)
      },
      2,
    )
  }

  entry(name: string): ChainedSet<any, this> {
    return this.entryPoints.getOrCompute(name, () => new ChainedSet(this))
  }

  plugin(name: string) {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name))
  }

  amd(value: any): this {
    return this.set('amd', value)
  }

  bail(value: boolean): this {
    return this.set('bail', value)
  }

  cache(value: any): this {
    return this.set('cache', value)
  }

  context(value: string): this {
    return this.set('context', value)
  }

  devtool(value: string | false): this {
    return this.set('devtool', value)
  }

  externals(value: any): this {
    return this.set('externals', value)
  }

  loader(value: any): this {
    return this.set('loader', value)
  }

  mode(value: string): this {
    return this.set('mode', value)
  }

  name(value: string): this {
    return this.set('name', value)
  }

  parallelism(value: number): this {
    return this.set('parallelism', value)
  }

  profile(value: boolean): this {
    return this.set('profile', value)
  }

  recordsInputPath(value: string): this {
    return this.set('recordsInputPath', value)
  }

  recordsPath(value: string): this {
    return this.set('recordsPath', value)
  }

  recordsOutputPath(value: string): this {
    return this.set('recordsOutputPath', value)
  }

  stats(value: any): this {
    return this.set('stats', value)
  }

  target(value: string | string[]): this {
    return this.set('target', value)
  }

  watch(value: boolean): this {
    return this.set('watch', value)
  }

  watchOptions(value: any): this {
    return this.set('watchOptions', value)
  }

  toConfig(): WebpackConfig {
    const entryPoints = this.entryPoints.entries() || {}

    return this.clean(
      Object.assign(this.entries() || {}, {
        node: this.node.entries(),
        output: this.output.entries(),
        resolve: this.resolve.toConfig(),
        resolveLoader: this.resolveLoader.toConfig(),
        devServer: this.devServer.toConfig(),
        module: this.module.toConfig(),
        optimization: this.optimization.toConfig(),
        plugins: this.plugins.values().map(plugin => plugin.toConfig()),
        performance: this.performance.entries(),
        entry: Object.keys(entryPoints).reduce(
          (acc, key) => Object.assign(acc, {[key]: entryPoints[key].values()}),
          {} as Record<string, any>,
        ),
      }),
    ) as WebpackConfig
  }

  override toString(options?: ConfigToStringOptions): string {
    return Config.toString(this.toConfig(), options)
  }

  override merge(obj: any = {}, omit: string[] = []): this {
    const omissions = [
      'node',
      'output',
      'resolve',
      'resolveLoader',
      'devServer',
      'optimization',
      'performance',
      'module',
    ]

    if (!omit.includes('entry') && 'entry' in obj) {
      Object.keys(obj.entry).forEach(name => this.entry(name).merge([].concat(obj.entry[name])))
    }

    if (!omit.includes('plugin') && 'plugin' in obj) {
      Object.keys(obj.plugin).forEach(name => this.plugin(name).merge(obj.plugin[name]))
    }

    omissions.forEach(key => {
      if (!omit.includes(key) && key in obj) {
        ;(this as any)[key].merge(obj[key])
      }
    })

    return super.merge(obj, [...omit, ...omissions, 'entry', 'plugin'])
  }
}
