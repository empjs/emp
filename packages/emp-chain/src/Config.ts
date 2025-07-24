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

export default class Config extends ChainedMap {
  devServer: DevServer
  entryPoints: ChainedMap
  module: Module
  node: ChainedMap
  optimization: Optimization
  output: Output
  performance: Performance
  plugins: ChainedMap
  resolve: Resolve
  resolveLoader: ResolveLoader

  constructor() {
    super({})
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

  static override toString(config: any, {verbose = false, configPrefix = 'config'} = {}): string {
    // eslint-disable-next-line global-require
    const {stringify} = require('javascript-stringify')

    return stringify(
      config,
      (value: any, indent: any, stringify: any) => {
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

  entry(name: string): ChainedSet {
    return this.entryPoints.getOrCompute(name, () => new ChainedSet(this))
  }

  plugin(name: string): any {
    return this.plugins.getOrCompute(name, () => new Plugin(this, name))
  }

  toConfig(): any {
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
        plugins: this.plugins.values().map((plugin: any) => plugin.toConfig()),
        performance: this.performance.entries(),
        entry: Object.keys(entryPoints).reduce(
          (acc, key) => Object.assign(acc, {[key]: entryPoints[key].values()}),
          {} as Record<string, any>,
        ),
      }),
    )
  }

  override toString(options?: any): string {
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
