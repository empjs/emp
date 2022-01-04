import {Compiler, Compilation} from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'
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
  entries?: string[]
  browser?: string
  uaReg?: string
  js?: string[]
  polyfills?: string[]
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
      // hooks.alterAssetTags.tapAsync(PluginName, async (htmlPluginData, callback) => {
      //   const ejsOptions = getEjsOptions(this.options.polyfill, polyfileJS)
      //   const resultString = await Ejs.renderFile(path.resolve(__dirname, '../src/tpl.ejs'), ejsOptions, {})
      //   const script = createHtmlTagObject('script', {type: 'text/javascript'}, resultString)
      //   htmlPluginData.assetTags.scripts.unshift(script)
      //   if (callback) {
      //     callback(null, htmlPluginData)
      //   } else {
      //     return Promise.resolve(htmlPluginData)
      //   }
      // })
      hooks.afterTemplateExecution.tapAsync(PluginName, async (opts, callback) => {
        const ejsOptions = getEjsOptions(this.options.polyfill, polyfileJS, opts.outputName)
        const resultString = await Ejs.renderFile(path.resolve(__dirname, '../src/tpl.ejs'), ejsOptions, {})
        opts.html = opts.html.replace('<!-- EMP inject polyfill -->', resultString)
        callback && callback(null, opts)
      })

      // hooks.beforeAssetTagGeneration.tapAsync(PluginName, async (opts, callback) => {
      //   const ejsOptions = getEjsOptions(this.options.polyfill, polyfileJS)
      //   const resultString = await Ejs.renderFile(path.resolve(__dirname, '../src/tpl.ejs'), ejsOptions, {})
      //   opts.assets.polyfillScript = [resultString]
      //   callback && callback(null, opts)
      // })
    })
  }
}

export default Plugin
