import {Compiler, Compilation} from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

export interface PolyfillOption {
  // 指定哪些入口需要增加此项polyfill, 不填则默认所有入口
  entries?: string[]
  // 内置浏览器判断。可选值：IE|ANDROID|IPHONE|MOBILE; 拓展中...
  browser?: string
  // 自定义判断条件。命中uaReg.test(ua)会架加载polyfills
  uaReg?: string
  // 插入的 js 地址
  js?: string[]
  // 单独打入corejs某项依赖。如'core-js/modules/es.array.unscopables.flat'
  polyfills?: string[]
  // key值。与打出的polyfills文件名有关
  name?: string
}

interface TplOption {
  rule: string
  js: string[]
}

const PluginName = 'polyfill-plugin'
const EntryName = 'polyfill'

let nameIndex = 0

const commonBrowserRule: {[key: string]: string} = {
  IE: 'window.document.documentMode',
  ANDROID: '/(?:Android)/.test(ua)',
  MOBILE: '/(?:Android)/.test(ua) || /(?:iPhone)/.test(ua)',
  IPHONE: '/(?:iPhone)/.test(ua)',
}

const polyfillName: string[] = []

const filterRepeat = (opts: TplOption[]) => {
  const map: {[key: string]: string[]} = {}
  opts.forEach(i => {
    if (!map[i.rule]) {
      map[i.rule] = i.js
    } else {
      map[i.rule] = map[i.rule].concat(i.js)
    }
  })
  const list = Object.entries(map).map(([k, v]) => ({rule: k, js: Array.from(new Set(v))}))
  return list
}

const getPolyfillName = (opt: PolyfillOption) => `${EntryName}_${opt?.browser}_${nameIndex++}`

const getEjsOptions = (opts: PolyfillOption[], polyfillMap: {[key: string]: string}, matchName: string) => {
  const list: TplOption[] = []
  opts.forEach(opt => {
    if (!opt.name) return
    if (
      opt.entries &&
      opt.entries.length &&
      opt.entries.indexOf(matchName) === -1 &&
      opt.entries.indexOf(matchName.replace('.html', '')) === -1
    )
      return
    const pf = polyfillMap[opt.name]
    const js = (pf ? [pf].concat(opt.js || []) : opt.js) || []
    if (opt.browser && commonBrowserRule[opt.browser.toUpperCase()]) {
      list.push({
        rule: commonBrowserRule[opt.browser.toUpperCase()],
        js,
      })
    } else {
      list.push({
        rule: `${opt.uaReg}.test(ua)`,
        js,
      })
    }
  })
  return {
    list: filterRepeat(list),
  }
}

const getPolyfillHtml = (opts: {list: TplOption[]}): string => {
  const {list} = opts
  const startStr = `<script type="text/javascript">!(function(){var ua = navigator.userAgent;`
  const endStr = `})()<\/script>`
  let contentStr = ''
  list.forEach(i => {
    contentStr += `if(${i.rule}){document.writeln('${i.js.map(js => `<script src="${js}"><\\/script>`).join('')}')}`
  })
  return `${startStr}${contentStr}${endStr}`
}

interface OptionsProps {
  polyfill: PolyfillOption[]
  publicPath?: string
}

class Plugin {
  options: OptionsProps

  constructor(opts: OptionsProps) {
    this.options = Object.assign({}, opts)
  }
  apply(compiler: Compiler) {
    compiler.hooks.environment.tap(PluginName, async () => {
      if (this.options.polyfill && this.options.polyfill.length) {
        const polyfillList = this.options.polyfill.filter(
          i => (i.browser || i.uaReg) && ((Array.isArray(i.polyfills) && i.polyfills.length) || (i.js && i.js.length)),
        )
        polyfillList.forEach(i => {
          const name = i.name || getPolyfillName(i)
          i.name = name
          polyfillName.push(name)
          if (i.polyfills && i.polyfills.length) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            compiler.options.entry[name] = {
              import: i.polyfills,
            }
          }
        })
      }
    })

    compiler.hooks.thisCompilation.tap(PluginName, (compilation: Compilation) => {
      const polyfileJS: {[key: string]: string} = {}
      compilation.hooks.processAssets.tapAsync(PluginName, (_compilationAssets, callback) => {
        polyfillName.forEach(name => {
          const files = compilation?.entrypoints?.get(name)?.getFiles()
          if (files && files.length) {
            polyfileJS[name] = `${this.options.publicPath}${files[0]}`
          }
        })

        callback && callback()
      })
      const hooks = HtmlWebpackPlugin.getHooks(compilation)
      const htmlPlugins = compilation.options.plugins.filter(plugin => plugin instanceof HtmlWebpackPlugin)
      if (htmlPlugins.length === 0) {
        const message = "Error! are you sure you have html-webpack-plugin before it in your config's plugins?"
        throw new Error(message)
      }

      hooks.afterTemplateExecution.tapAsync(PluginName, async (opts, callback) => {
        const ejsOptions = getEjsOptions(this.options.polyfill, polyfileJS, opts.outputName)
        const resultString = getPolyfillHtml(ejsOptions)
        opts.html = opts.html.replace('<!-- EMP inject polyfill -->', resultString)
        callback && callback(null, opts)
      })
    })
  }
}

export default Plugin
