import type {GlobalStore} from '@empjs/cli'
import browserslist from 'browserslist'
import {browserslistToTargets} from 'lightningcss'
import path from 'path'
import type {PluginLightningcssOptions} from './types.js'

const uselightningcssLoader = async (store: GlobalStore, o: PluginLightningcssOptions = {}) => {
  if (!o.transform) return
  o.transform = typeof o.transform !== 'boolean' ? o.transform : {}
  o.enablePostcss = o.enablePostcss !== undefined ? o.enablePostcss : false
  const {chain} = store
  const ruleMap = ['sass', 'less', 'css']
  //
  // const targets = browserslistToTargets(browserslist('>= 0.25%'))
  const targets = browserslistToTargets(browserslist(store.empConfig.build.polyfill.browserslist))
  //
  const loaderOptions = {targets, ...o.transform}
  for (const ruleName of ruleMap) {
    const rule = chain.module.rule(ruleName)
    const useLightningcss = rule
      .use('lightningcss')
      .loader(path.resolve(__dirname, 'loader.cjs'))
      .options(loaderOptions)
    if (['sass', 'less'].includes(ruleName)) {
      useLightningcss.before(`${ruleName}Loader`)
    }
    /**
     * 启用tailwindcss 时、要保留postcss 插件
     */
    if (o.enablePostcss === false) {
      rule.uses.delete('postcss')
    }
  }
}
const uselightningcssMinify = async (store: GlobalStore, o: PluginLightningcssOptions = {}) => {
  if (!o.minify) return
  o.minify = typeof o.minify !== 'boolean' ? o.minify : {}
  if (!o.minify.targets) {
    o.minify.targets = browserslistToTargets(browserslist(store.empConfig.build.polyfill.browserslist))
  }
  const {chain} = store
  const {LightningCSSMinifyPlugin} = await import('./minimizer')
  chain.optimization.minimizer('minCss').use(LightningCSSMinifyPlugin, [o.minify])
  // chain.optimization.minimizer('minCss').use(path.resolve(__dirname, 'minimizer'), [o.minify])
}

//
const empLightningcssPlugin = (o: PluginLightningcssOptions = {}) => {
  if (o.transform && typeof o.minify === 'undefined') o.minify = true
  return {
    name: '@empjs/plugin-lightningcss',
    async rsConfig(store: GlobalStore) {
      await Promise.all([uselightningcssLoader(store, o), uselightningcssMinify(store, o)])
    },
  }
}
export default empLightningcssPlugin
