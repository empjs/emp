import {Compiler, Compilation} from 'webpack'
import HtmlWebpackPlugin, {createHtmlTagObject} from 'html-webpack-plugin'
import Ejs from 'ejs'
import path from 'path'
// import fs from 'fs'

// const writeIfModified = function (filename: string, newContent: string) {
//   try {
//     const oldContent = fs.readFileSync(filename, 'utf8')
//     if (oldContent == newContent) {
//       console.warn(`* Skipping file '${filename}' because it is up-to-date`)
//       return
//     }
//   } catch (err) {}
//   if (['0', 'false'].indexOf(process.env.DRY_RUN || '0') !== -1) {
//     fs.writeFileSync(filename, newContent)
//   }
//   console.warn(`* Updating outdated file '${filename}'`)
// }

export interface PolyfillOption {
  browser?: string
  uaReg?: string
  js?: string[]
  polyfills?: string[]
  name?: string
}

const PluginName = 'polyfill-plugin'
const EntryName = 'polyfill'

let nameIndex = 0

const commonBrowserRule: {[key: string]: string} = {
  IE: 'window.document.documentMode',
  ANDROID: '/(?:Android)/.test(ua)',
  MOBILE: '/(?:Android)/.test(ua) || /(?:iPhone)/.test(ua)',
}

const polyfillName: string[] = []

const getPolyfillName = (opt: PolyfillOption) => `${EntryName}_${opt?.browser || nameIndex++}`

const getEjsOptions = (opts: PolyfillOption[], polyfillMap: {[key: string]: string}) => {
  const list: {rule: string; js: string[]}[] = []
  opts.forEach(opt => {
    if (!opt.name) return
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
    list,
  }
}

class Plugin {
  options: {polyfill: PolyfillOption[]}

  constructor(opts: {polyfill: PolyfillOption[]}) {
    this.options = Object.assign({}, opts)
  }
  apply(compiler: Compiler) {
    compiler.hooks.environment.tap(PluginName, async () => {
      if (this.options.polyfill && this.options.polyfill.length) {
        const polyfillList = this.options.polyfill.filter(
          i => (i.browser || i.uaReg) && Array.isArray(i.polyfills) && i.polyfills.length,
        )
        polyfillList.forEach(i => {
          const name = i.name || getPolyfillName(i)
          i.name = name
          polyfillName.push(name)
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          compiler.options.entry[name] = {
            import: i.polyfills,
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
            polyfileJS[name] = files[0]
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
      hooks.alterAssetTags.tapAsync(PluginName, async (htmlPluginData, callback) => {
        const ejsOptions = getEjsOptions(this.options.polyfill, polyfileJS)
        const resultString = await Ejs.renderFile(path.resolve(__dirname, '../src/tpl.ejs'), ejsOptions, {})
        const script = createHtmlTagObject('script', {type: 'text/javascript'}, resultString)
        htmlPluginData.assetTags.scripts.unshift(script)

        if (callback) {
          callback(null, htmlPluginData)
        } else {
          return Promise.resolve(htmlPluginData)
        }
      })
    })
  }
}

export default Plugin
