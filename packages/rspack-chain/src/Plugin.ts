import ChainedMap from './ChainedMap'
import Orderable from './Orderable'

interface PluginInstance {
  __pluginName?: string
  __pluginType?: string
  __pluginArgs?: any[]
  __pluginConstructorName?: string
  __pluginPath?: string | null
  [key: string]: any
}

type PluginClass = new (...args: any[]) => any
type PluginFunction = (...args: any[]) => any
type PluginType = PluginClass | PluginFunction | string

type InitFunction = (Plugin: PluginType, args?: any[]) => PluginInstance

class PluginBase<P = any> extends ChainedMap<any, P> {
  name: string
  type: string

  constructor(parent: P, name: string, type = 'plugin') {
    super(parent)
    this.name = name
    this.type = type
    this.extend(['init'])

    this.init((Plugin: PluginType, args: any[] = []) => {
      if (typeof Plugin === 'function') {
        return new (Plugin as PluginClass)(...args)
      }
      return Plugin as unknown as PluginInstance
    })
  }

  use(plugin: PluginType, args: any[] = []): this {
    return this.set('plugin', plugin).set('args', args)
  }

  tap(f: (args: any[]) => any[]): this {
    if (!this.has('plugin')) {
      throw new Error(
        `Cannot call .tap() on a plugin that has not yet been defined. Call ${this.type}('${this.name}').use(<Plugin>) first.`,
      )
    }
    this.set('args', f(this.get('args') || []))
    return this
  }

  override set(key: string, value: any): this {
    if (key === 'args' && !Array.isArray(value)) {
      throw new Error('args must be an array of arguments')
    }
    return super.set(key, value)
  }

  override merge(obj: any, omit: string[] = []): this {
    if ('plugin' in obj) {
      this.set('plugin', obj.plugin)
    }

    if ('args' in obj) {
      this.set('args', obj.args)
    }

    return super.merge(obj, [...omit, 'args', 'plugin'])
  }

  // 方法重载声明
  init(fn: InitFunction): this
  init(): PluginInstance

  // 方法实现
  init(fn?: InitFunction): this | PluginInstance {
    if (fn) {
      // 设置初始化函数
      return this.set('init', fn)
    } else {
      // 执行初始化并返回实际的插件实例
      const initFn = this.get('init') as InitFunction
      const plugin = this.get('plugin') as PluginType
      const args = this.get('args') as any[]

      if (!plugin) {
        throw new Error(
          `Invalid ${this.type} configuration: ${this.type}('${this.name}').use(<Plugin>) was not called to specify the plugin`,
        )
      }

      if (!initFn) {
        throw new Error(
          `Invalid ${this.type} configuration: initialization function is not defined`,
        )
      }

      // 直接调用初始化函数并返回结果
      return initFn(plugin, args)
    }
  }

  toConfig(): PluginInstance {
    const init = this.get('init') as InitFunction
    let plugin = this.get('plugin') as PluginType
    const args = this.get('args') as any[]
    let pluginPath: string | null = null

    if (plugin === undefined) {
      throw new Error(
        `Invalid ${this.type} configuration: ${this.type}('${this.name}').use(<Plugin>) was not called to specify the plugin`,
      )
    }

    // Support using the path to a plugin rather than the plugin itself,
    // allowing expensive require()s to be skipped in cases where the plugin
    // or webpack configuration won't end up being used.
    if (typeof plugin === 'string') {
      pluginPath = plugin
      // eslint-disable-next-line global-require, import/no-dynamic-require
      plugin = require(pluginPath)
    }

    const constructorName = (plugin as any).__expression ? `(${(plugin as any).__expression})` : (plugin as any).name

    const config = init(plugin, args)

    Object.defineProperties(config, {
      __pluginName: {value: this.name},
      __pluginType: {value: this.type},
      __pluginArgs: {value: args},
      __pluginConstructorName: {value: constructorName},
      __pluginPath: {value: pluginPath},
    })

    return config
  }
}

export default Orderable(PluginBase)
